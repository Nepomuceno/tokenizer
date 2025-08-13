# Tokenizers Directory

This directory contains tokenizer.json files for HuggingFace-compatible models like Llama, Mistral, Qwen, etc.

## Current Files

- `mistral.json` - Official Mistral tokenizer (compatible with Mistral 7B, Large, Small, etc.)
- `qwen.json` - Official Qwen tokenizer (for Qwen 2.5 models, also used as fallback for Llama models)
- `phi-3.5.json` - Official Phi-3.5 tokenizer (for Microsoft Phi models)
- `deepseek-r1.json` - Official DeepSeek R1 tokenizer (for DeepSeek R1 models)
- `deepseek-v3.json` - Official DeepSeek V3 tokenizer (for DeepSeek V3 models)

## Model Tokenizer Assignments

### Official Tokenizers (Exact Match)

- **Mistral models** → `mistral.json`
- **Qwen models** → `qwen.json`
- **Phi models** → `phi-3.5.json`
- **DeepSeek V3** → `deepseek-v3.json`
- **DeepSeek R1** → `deepseek-r1.json`

### Temporary Fallback Tokenizers

- **Llama models** → `qwen.json` (marked with "~temp" in UI)
  - These models don't have their official tokenizers available yet
  - Qwen tokenizer provides reasonable approximation for token counting
  - Results may not be perfectly accurate

## Adding New Tokenizers

To add support for additional models:

1. Download the `tokenizer.json` file from the model's HuggingFace repository
2. Place it in this directory with a descriptive name
3. Update the model registry in `src/modelRegistry.ts` to reference the new file

## Example

For Llama 3.1 models, you would:

1. Visit [the Meta-Llama-3.1-8B-Instruct model page](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct)
2. Download the `tokenizer.json` file (requires HuggingFace login and model access)
3. Save it as `llama-3.1.json` in this directory
4. Update the model registry to use the official tokenizer instead of the Qwen fallback

## Note

Due to licensing and access restrictions, actual tokenizer files for production models are not included in this repository. Users need to obtain them directly from HuggingFace.
