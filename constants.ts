
export const SYSTEM_CONTEXT = `
You are an AI research assistant specialized in academic papers.
You must:
- Read and reason only from provided paper content
- Cite section names when answering (e.g., [Introduction], [Methodology])
- Refuse to hallucinate missing information. If information is missing, state "Not covered in this paper".
- Separate facts, assumptions, and predictions explicitly
- Maintain academic tone and structure
- Output must be formatted in Markdown.
`;

export const ROADMAP_PROMPT = `
You are an expert scientific knowledge graph engine. Your task is to generate a learning roadmap for a target arXiv paper that a user has already fetched. You will be provided the paper metadata in variables. Use this data to determine all prerequisite concepts and suggest teaching papers.

INPUT VARIABLES:
- paper_title = "{title}"
- paper_abstract = "{abstract}"
- paper_arxiv_id = "{arxiv_id}"

TASK:
1. Identify all concepts necessary to understand the target paper.
2. For each concept:
   a. Provide a one-sentence definition.
   b. Suggest 1-3 introductory or survey papers from arXiv that teach it, including arXiv links.
3. Recursively expand concept prerequisites if needed, but stop at undergraduate-level concepts.
4. Construct a **linear learning path** from fundamental concepts → intermediate concepts → target paper.

OUTPUT FORMAT (JSON ONLY):

{
  "target_paper": {
    "title": "{paper_title}",
    "arxiv_id": "{paper_arxiv_id}",
    "link": "https://arxiv.org/abs/{paper_arxiv_id}"
  },
  "roadmap": [
    {
      "step": 1,
      "concept": {
        "name": "Concept Name",
        "definition": "One-sentence definition"
      },
      "recommended_papers": [
        {
          "title": "Paper Title",
          "arxiv_id": "arXiv ID",
          "link": "https://arxiv.org/abs/arXiv_ID",
          "reason": "Why this paper is recommended"
        }
      ]
    }
  ]
}

RULES:
- Steps must be ordered from foundational → intermediate → target paper.
- Include only concepts necessary for understanding the target paper.
- Include only arXiv papers as references.
- Avoid hallucinations: if a concept or prerequisite cannot be reliably determined, omit it.
- Ensure no circular dependencies.

FAILURE MODE:
If the roadmap cannot be reliably generated from the provided metadata, return:
{
  "error": "Insufficient information to construct a reliable learning roadmap."
}
`;

export const PROMPTS = {
  SUMMARY: `
Task: Generate a structured summary of the provided paper.
Sections required:
1) Problem Statement
2) Motivation
3) Method Overview
4) Key Contributions
5) Experimental Results
6) Limitations

Constraints:
- No interpretation beyond text
- Bullet points only
- Cite section names for every major claim
`,
  GAPS: `
Task: Identify research gaps strictly based on the provided paper's content (especially Limitations, Discussion, Future Work).
Classify gaps into:
- Methodological gaps
- Data gaps
- Evaluation gaps
- Application gaps

Output a Markdown table:
| Gap Type | Description | Evidence Section |
`,
  PREDICTIONS: `
Task: Based ONLY on the Results, Limitations, and Trends mentioned in the provided paper, predict the research trajectory.
Predict:
- Likely next research directions
- Possible real-world applications
- Extension opportunities

Rules:
- Clearly label predictions as speculative
- Max 5 predictions
- Do not use external knowledge outside the paper context
`,
  EQUATION: `
Task: Explain the following equation or technical concept from the paper in simple, intuitive terms.
Identify the variables, the mathematical operation's purpose, and why this specific formulation is significant to the paper's overall methodology.

Selection to explain: 
`
};

export const DEMO_PAPER_TEXT = `
Title: Attention Is All You Need
Authors: Ashish Vaswani et al.

Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.

1. Introduction
Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation.
...
[Simulated content for demo purposes: The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.]

2. Background
The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet and ConvS2S, all of which use convolutional neural networks as basic building blocks.

3. Model Architecture
Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations to a sequence of continuous representations.
3.1 Encoder and Decoder Stacks
The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network.

Equation 1: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V
The attention function can be described as mapping a query and a set of key-value pairs to an output.

4. Why Self-Attention
In this section we compare various aspects of self-attention layers to the recurrent and convolutional layers commonly used for mapping one variable-length sequence of symbol representations to another.

5. Training
This section describes the training regime for our models.

6. Results
On the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big)) outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4.

7. Conclusion
In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention.
We plan to extend the Transformer to problems involving input and output modalities other than text and to investigate local, restricted attention mechanisms to efficiently handle large inputs and outputs such as images, audio and video.
`;
