import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const HYGRAPH_ENDPOINT =
  "https://eu-west-2.cdn.hygraph.com/content/cmic8lwzx01e407w429wkjxja/master";

const HYGRAPH_MANAGEMENT_TOKEN = process.env.HYGRAPH_MANAGEMENT_TOKEN;

app.post("/api/create-detective", async (req, res) => {
  try {
    const {
      name,
      age,
      nationality,
      introduction,
      appearingInMedia,
      profilePhotoId,
    } = req.body;

    const mutation = `
      mutation CreateDetective(
        $name: String!
        $age: String!
        $nationality: String!
        $introduction: String!
        $appearingInMedia: String!

      ) {
        createDetective(
          data: {
            name: $name
            age: $age
            nationality: $nationality
            introduction: $introduction
            appearingInMedia: $appearingInMedia
            
          }
        ) {
          id
          name
        }
      }
    `;

    const publishMutation = `
      mutation PublishDetective($id: ID!) {
      publishDetective(where: { id: $id }) {
      id
        }
      }
    `;

    const variables = {
      name,
      age,
      nationality,
      introduction,
      appearingInMedia,

    };

    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: "POST",
      headers: {
      Authorization: `Bearer ${HYGRAPH_MANAGEMENT_TOKEN}`,
      "Content-Type": "application/json",
    },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const result = await response.json();

    // Get the ID from the created detective
    const detectiveId = result.data.createDetective.id;
    // Publish the detective
    const publishResponse = await fetch(HYGRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HYGRAPH_MANAGEMENT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: publishMutation,
        variables: { id: detectiveId }
      }),
    });
    const publishResult = await publishResponse.json();
    if (publishResult.errors) {
      console.error(publishResult.errors);
      return res.status(400).json(publishResult);
    }

    if (result.errors) {
      console.error(result.errors);
      return res.status(400).json(result);
    }

    res.json({ success: true, detective: result.data.createDetective });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
