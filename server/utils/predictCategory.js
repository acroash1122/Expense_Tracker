const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

const predictCategory = async (text) => {
  const contextText = `This transaction is about ${text}`;
  console.log("🧠 Sending to Hugging Face:", contextText);

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/joeddav/xlm-roberta-large-xnli', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: contextText,
        parameters: {
          candidate_labels: [
            'Food', 'Rent', 'Salary', 'Bills',
            'Shopping', 'Entertainment', 'Transport',
            'Education', 'Other'
          ],
          hypothesis_template: "This transaction is about {}."
        }
      })
    });

    console.log("📡 HF API status:", response.status);

    const data = await response.json();
    console.log("🔍 HF API response:", JSON.stringify(data, null, 2));

    const labels = data.labels;
    const scores = data.scores;

    // ✅ Validate structure
    if (!labels || !scores || !Array.isArray(labels) || labels.length === 0) {
      console.warn("⚠️ No valid label received from HF.");
      return { category: 'Misc', rawCategory: text };
    }

    // ✅ Adjust confidence threshold if needed
    if (scores[0] >= 0.3) {
      console.log(`✅ Predicted: ${labels[0]} (confidence: ${scores[0].toFixed(2)})`);
      return { category: labels[0], rawCategory: text };
    }

    console.warn("⚠️ Confidence too low. Defaulting to 'Misc'");
    return { category: 'Misc', rawCategory: text };

  } catch (err) {
    console.error("❌ Hugging Face API Error:", err.message);
    return { category: 'Misc', rawCategory: text };
  }
};

module.exports = predictCategory;
