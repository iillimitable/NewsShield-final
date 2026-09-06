
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("./models/User");
const Verification = require("./models/Verification");

const app = express();

const PORT = process.env.PORT || 5000;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.8-flash";

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(
  express.json({
    limit: "5mb",
  })
);

// ==========================================
// MONGODB CONNECTION
// ==========================================

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(
        "MongoDB connected successfully"
      );
    })
    .catch((error) => {
      console.error(
        "MongoDB connection error:",
        error.message
      );
    });
} else {
  console.log(
    "MONGO_URI not found. MongoDB features may not work."
  );
}

// ==========================================
// BASIC ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "NewsShield Backend is running",
  });
});

// ==========================================
// REGISTER API
// ==========================================

app.post(
  "/api/auth/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          error:
            "Name, email and password are required.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error:
            "Password must be at least 6 characters.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          error:
            "An account with this email already exists.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        });

      const token = jwt.sign(
        {
          userId:
            user._id.toString(),
        },
        process.env.JWT_SECRET ||
          "newsshield_secret_key_2026",
        {
          expiresIn: "7d",
        }
      );

      res.status(201).json({
        message:
          "Registration successful.",

        token,

        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error.message
      );

      res.status(500).json({
        error:
          "Registration failed.",
      });
    }
  }
);

// ==========================================
// LOGIN API
// ==========================================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          error:
            "Email and password are required.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const user =
        await User.findOne({
          email: normalizedEmail,
        });

      if (!user) {
        return res.status(401).json({
          error:
            "Invalid email or password.",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          error:
            "Invalid email or password.",
        });
      }

      const token = jwt.sign(
        {
          userId:
            user._id.toString(),
        },
        process.env.JWT_SECRET ||
          "newsshield_secret_key_2026",
        {
          expiresIn: "7d",
        }
      );

      res.json({
        message:
          "Login successful.",

        token,

        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error.message
      );

      res.status(500).json({
        error:
          "Login failed.",
      });
    }
  }
);

// ==========================================
// TAVILY SEARCH
// ==========================================

async function searchNews(
  claim
) {
  if (!process.env.TAVILY_API_KEY) {
    throw new Error(
      "TAVILY_API_KEY is missing."
    );
  }

  const response =
    await axios.post(
      "https://api.tavily.com/search",
      {
        api_key:
          process.env.TAVILY_API_KEY,

        query: claim,

        search_depth:
          "advanced",

        topic: "news",

        max_results: 20,

        include_answer: true,

        include_raw_content: true,

        include_images: false,
      },
      {
        timeout: 60000,
      }
    );

  const results =
    Array.isArray(
      response.data?.results
    )
      ? response.data.results
      : [];

  return results.map(
    (source) => ({
      title:
        source.title || "",

      url:
        source.url || "",

      content:
        source.raw_content ||
        source.content ||
        "",

      score:
        Number(
          source.score
        ) || 0,
    })
  );
}

// ==========================================
// GEMINI VERIFICATION
// ==========================================

async function geminiVerify(
  claim,
  sources
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing."
    );
  }

  const sourceText =
    sources
      .slice(0, 18)
      .map(
        (
          source,
          index
        ) => {
          return `SOURCE ${index + 1}
Title: ${source.title || ""}
URL: ${source.url || ""}
Content: ${(source.content || "").slice(
            0,
            4000
          )}`;
        }
      )
      .join("\n\n");

  const prompt = `
You are NewsShield, a professional news verification system.

Verify the following news claim using ONLY the provided web sources.

CLAIM:
${claim}

WEB SOURCES:
${sourceText}

Choose exactly one verdict:

Real
Fake
Unverified

Rules:

1. Use only the provided evidence.
2. Do not invent facts.
3. Direct reliable support means Real.
4. Direct reliable contradiction means Fake.
5. Insufficient or conflicting evidence means Unverified.
6. Check dates, names, locations and numbers carefully.
7. Similar topics are not enough evidence.
8. Prefer official sources and multiple independent reliable sources.
9. Confidence must represent how strongly the available evidence supports the verdict.
10. Supporting and contradicting values must be percentages from 0 to 100.

Return ONLY valid JSON.

Use exactly this structure:

{
  "verdict": "Real",
  "reason": "Short evidence-based explanation",
  "confidence": 80,
  "supporting": 70,
  "contradicting": 30
}
`;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    GEMINI_MODEL +
    ":generateContent";

  let lastError = null;

  // ========================================
  // GEMINI REQUEST
  // ========================================

  for (
    let attempt = 1;
    attempt <= 3;
    attempt++
  ) {
    try {
      console.log(
        `Gemini request attempt ${attempt}/3`
      );

      const response =
        await axios.post(
          url,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],

            generationConfig: {
              temperature: 0.1,

              responseMimeType:
                "application/json",
            },
          },
          {
            headers: {
              "Content-Type":
                "application/json",

              "x-goog-api-key":
                process.env.GEMINI_API_KEY,
            },

            timeout: 60000,
          }
        );

      const text =
        response.data
          ?.candidates?.[0]
          ?.content?.parts?.[0]
          ?.text;

      if (!text) {
        throw new Error(
          "Empty Gemini response."
        );
      }

      console.log(
        "Gemini raw response:",
        text
      );

      let parsedResult;

      try {
        parsedResult =
          JSON.parse(text);
      } catch (parseError) {
        console.error(
          "Gemini JSON parse error:",
          parseError.message
        );

        throw new Error(
          "Gemini returned invalid JSON."
        );
      }

      return {
        verdict:
          parsedResult.verdict ||
          "Unverified",

        reason:
          parsedResult.reason ||
          "Gemini could not provide a verification reason.",

        confidence:
          Number(
            parsedResult.confidence
          ) || 0,

        supporting:
          Number(
            parsedResult.supporting
          ) || 0,

        contradicting:
          Number(
            parsedResult.contradicting
          ) || 0,
      };
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini attempt ${attempt} failed.`
      );

      console.error(
        "Gemini status:",
        error.response?.status ||
          "Unavailable"
      );

      console.error(
        "Gemini response:",
        error.response?.data ||
          "No response data"
      );

      console.error(
        "Gemini message:",
        error.message
      );

      // QUOTA ERROR

      if (
        error.response?.status ===
        429
      ) {
        console.log(
          "Gemini quota exceeded."
        );

        throw new Error(
          "Gemini API quota exceeded."
        );
      }

      // RETRY 503

      if (
        error.response?.status ===
          503 &&
        attempt < 3
      ) {
        console.log(
          "Gemini temporarily unavailable. Retrying in 3 seconds..."
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              3000
            )
        );

        continue;
      }

      break;
    }
  }

  throw new Error(
    `Gemini API failed: ${
      lastError?.response
        ?.status ||
      lastError?.message ||
      "Unknown error"
    }`
  );
}

// ==========================================
// SEARCH API
// ==========================================

app.post(
  "/api/search",
  async (req, res) => {
    try {
      const { text } =
        req.body;

      if (
        !text ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            "Please provide news text.",
        });
      }

      console.log(
        "Search request:",
        text
      );

      const sources =
        await searchNews(
          text.trim()
        );

      console.log(
        "Sources found:",
        sources.length
      );

      res.json({
        query: text.trim(),
        sources,
      });
    } catch (error) {
      console.error(
        "Search API error:",
        error.message
      );

      res.status(500).json({
        message:
          error.message ||
          "Search failed.",
      });
    }
  }
);

// ==========================================
// VERIFY NEWS API
// ==========================================

app.post(
  "/api/verify",
  async (req, res) => {
    try {
      const { text } =
        req.body;

      if (
        !text ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            "Please provide news text.",
        });
      }

      const claim =
        text.trim();

      console.log(
        "\n========================================"
      );

      console.log(
        "NewsShield verification started"
      );

      console.log(
        "Claim:",
        claim
      );

      console.log(
        "========================================"
      );

      // ======================================
      // STEP 1: TAVILY SEARCH
      // ======================================

      let sources = [];

      try {
        sources =
          await searchNews(
            claim
          );

        console.log(
          "Tavily sources:",
          sources.length
        );
      } catch (searchError) {
        console.error(
          "Tavily search failed:",
          searchError.message
        );

        return res.status(500).json({
          message:
            "Unable to search web sources.",
        });
      }

      // ======================================
      // NO SOURCES
      // ======================================

      if (
        sources.length === 0
      ) {
        return res.json({
          verdict:
            "Unverified",

          reason:
            "No reliable web sources were found to verify this claim.",

          confidence: 20,

          evidenceScore: 0,

          supportingScore: 0,

          contradictingScore: 0,

          supportingPercentage: 0,

          contradictingPercentage: 0,

          analysisEngine:
            "Tavily Web Search",

          sources: [],
        });
      }

      // ======================================
      // STEP 2: GEMINI VERIFICATION
      // ======================================

      let result;

      try {
        result =
          await geminiVerify(
            claim,
            sources
          );

        console.log(
          "Gemini verification result:",
          result
        );
      } catch (error) {
        console.error(
          "Gemini verification failed:",
          error.message
        );

        result = {
          verdict:
            "Unverified",

          reason:
            "Web sources were found, but Gemini AI analysis is temporarily unavailable.",

          confidence: 30,

          supporting: 0,

          contradicting: 0,
        };
      }

      // ======================================
      // SCORE NORMALIZATION
      // ======================================

      const confidence =
        Math.max(
          0,
          Math.min(
            100,
            Number(
              result.confidence
            ) || 0
          )
        );

      const supporting =
        Math.max(
          0,
          Math.min(
            100,
            Number(
              result.supporting
            ) || 0
          )
        );

      const contradicting =
        Math.max(
          0,
          Math.min(
            100,
            Number(
              result.contradicting
            ) || 0
          )
        );

      const supportingScore =
        supporting / 100;

      const contradictingScore =
        contradicting / 100;

      const evidenceScore =
        Math.max(
          0,
          Math.min(
            1,
            confidence / 100
          )
        );

      // ======================================
      // FINAL RESPONSE
      // ======================================

      const verificationResponse =
        {
          verdict:
            result.verdict ||
            "Unverified",

          reason:
            result.reason ||
            "Unable to determine the truth of this claim.",

          confidence,

          evidenceScore,

          supportingScore,

          contradictingScore,

          supportingPercentage:
            supporting,

          contradictingPercentage:
            contradicting,

          analysisEngine:
            "Tavily Web Search + Gemini LLM",

          sources,
        };

      console.log(
        "Verification completed."
      );

      console.log(
        "Verdict:",
        verificationResponse.verdict
      );

      res.json(
        verificationResponse
      );
    } catch (error) {
      console.error(
        "Verification API error:",
        error.message
      );

      console.error(
        "Verification stack:",
        error.stack
      );

      res.status(500).json({
        message:
          "Unable to verify the news.",
      });
    }
  }
);

// ==========================================
// SAVE VERIFICATION HISTORY
// ==========================================

app.post(
  "/api/history",
  async (req, res) => {
    try {
      const {
        userId,
        title,
        verdict,
        reason,
        confidence,
        evidenceScore,
        supportingScore,
        contradictingScore,
        supportingPercentage,
        contradictingPercentage,
        analysisEngine,
        sources,
      } = req.body;

      console.log(
        "\n========================================"
      );

      console.log(
        "Saving verification history to MongoDB"
      );

      console.log(
        "User ID:",
        userId
      );

      console.log(
        "Title:",
        title
      );

      console.log(
        "========================================"
      );

      // ======================================
      // VALIDATION
      // ======================================

      if (!userId) {
        return res.status(400).json({
          error:
            "User ID is required.",
        });
      }

      if (
        !title ||
        !title.trim()
      ) {
        return res.status(400).json({
          error:
            "News title is required.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid user ID.",
        });
      }

      // ======================================
      // COMPACT SOURCES
      // ======================================

      const compactSources =
        Array.isArray(sources)
          ? sources
              .map(
                (source) => {
                  if (
                    typeof source ===
                    "string"
                  ) {
                    return {
                      title:
                        source,
                      url:
                        source,
                    };
                  }

                  return {
                    title:
                      source?.title ||
                      "",
                    url:
                      source?.url ||
                      "",
                  };
                }
              )
              .filter(
                (source) =>
                  source.url
              )
              .slice(0, 20)
          : [];

      // ======================================
      // SAVE TO MONGODB
      // ======================================

      const verification =
        await Verification.create(
          {
            userId:
              new mongoose.Types.ObjectId(
                userId
              ),

            title:
              title.trim(),

            verdict:
              verdict ||
              "Unverified",

            reason:
              reason || "",

            confidence:
              Number(
                confidence
              ) || 0,

            evidenceScore:
              Number(
                evidenceScore
              ) || 0,

            supportingScore:
              Number(
                supportingScore
              ) || 0,

            contradictingScore:
              Number(
                contradictingScore
              ) || 0,

            supportingPercentage:
              Number(
                supportingPercentage
              ) || 0,

            contradictingPercentage:
              Number(
                contradictingPercentage
              ) || 0,

            analysisEngine:
              analysisEngine ||
              "Tavily Web Search + Gemini AI",

            sources:
              compactSources,
          }
        );

      console.log(
        "SUCCESS: History saved to MongoDB"
      );

      console.log(
        "MongoDB History ID:",
        verification._id.toString()
      );

      res.status(201).json({
        message:
          "Verification history saved successfully.",

        history:
          verification,
      });
    } catch (error) {
      console.error(
        "\n========================================"
      );

      console.error(
        "FAILED: MongoDB history save"
      );

      console.error(
        "Error:",
        error.message
      );

      console.error(
        "========================================\n"
      );

      res.status(500).json({
        error:
          "Failed to save verification history.",

        details:
          error.message,
      });
    }
  }
);

// ==========================================
// GET VERIFICATION HISTORY
// ==========================================

app.get(
  "/api/history/:userId",
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      if (!userId) {
        return res.status(400).json({
          error:
            "User ID is required.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid user ID.",
        });
      }

      const history =
        await Verification.find({
          userId:
            new mongoose.Types.ObjectId(
              userId
            ),
        }).sort({
          createdAt: -1,
        });

      console.log(
        `History fetched for user ${userId}: ${history.length} records`
      );

      res.json({
        history,
      });
    } catch (error) {
      console.error(
        "Get history error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to fetch verification history.",
      });
    }
  }
);

// ==========================================
// DELETE ONE VERIFICATION
// ==========================================

app.delete(
  "/api/history/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!id) {
        return res.status(400).json({
          error:
            "History ID is required.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid history ID.",
        });
      }

      const deletedHistory =
        await Verification.findByIdAndDelete(
          id
        );

      if (!deletedHistory) {
        return res.status(404).json({
          error:
            "History record not found.",
        });
      }

      console.log(
        "History deleted:",
        id
      );

      res.json({
        message:
          "Verification history deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete history error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to delete verification history.",
      });
    }
  }
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(
  (req, res) => {
    res.status(404).json({
      message:
        "API route not found.",
    });
  }
);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Global server error:",
      error.message
    );

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      message:
        "Internal server error.",
    });
  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  () => {
    console.log(
      "\n========================================"
    );

    console.log(
      `NewsShield Backend running on http://localhost:${PORT}`
    );

    console.log(
      "========================================\n"
    );
  }
);

