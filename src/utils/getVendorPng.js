/**
 * 根据模型名称智能匹配厂商logo图片路径
 * @param {string} modelName
 * @returns {string} 图片路径
 */
export function getVendorPng(modelName) {
  if (!modelName) return '/vendors/default.png';
  const name = modelName.toLowerCase();

  // 文心一言专属匹配
  if (/wenxin|ernie|文心|yiyan/.test(name)) return '/vendors/wenxin.png';

  // 先按模型名特征匹配
  if (/gpt|openai|dall[ -]?e|whisper/.test(name)) return '/vendors/openai.png';
  if (/claude|anthropic/.test(name)) return '/vendors/anthropic.png';
  if (/gemini|palm|google/.test(name)) return '/vendors/google.png';
  if (/mistral|mixtral/.test(name)) return '/vendors/mistral.png';
  if (/command[-_ ]?r|cohere/.test(name)) return '/vendors/cohere.png';
  if (/llama|huggingface|hf-/.test(name)) return '/vendors/huggingface.png';
  if (/ollama/.test(name)) return '/vendors/huggingface.png';
  if (/qianfan|ernie|baidu/.test(name)) return '/vendors/qianfan.png';
  if (/tongyi|qwen|dashscope|ali|alibaba/.test(name)) return '/vendors/tongyi.png';
  if (/deepseek/.test(name)) return '/vendors/deepseek.png';
  if (/moonshot/.test(name)) return '/vendors/moonshot.png';
  if (/yi[-_ ]?\d|zhipu|glm|chatglm/.test(name)) return '/vendors/zhipu.png';
  if (/spark|xinghuo|iflytek|讯飞/.test(name)) return '/vendors/spark.png';

  // fallback: 按厂商品牌名再匹配一次
  if (/openai/.test(name)) return '/vendors/openai.png';
  if (/anthropic/.test(name)) return '/vendors/anthropic.png';
  if (/google/.test(name)) return '/vendors/google.png';
  if (/mistral/.test(name)) return '/vendors/mistral.png';
  if (/cohere/.test(name)) return '/vendors/cohere.png';
  if (/huggingface/.test(name)) return '/vendors/huggingface.png';
  if (/ollama/.test(name)) return '/vendors/huggingface.png';
  if (/qianfan|baidu/.test(name)) return '/vendors/qianfan.png';
  if (/tongyi|ali|alibaba/.test(name)) return '/vendors/tongyi.png';
  if (/deepseek/.test(name)) return '/vendors/deepseek.png';
  if (/moonshot/.test(name)) return '/vendors/moonshot.png';
  if (/zhipu/.test(name)) return '/vendors/zhipu.png';
  if (/spark|iflytek|讯飞/.test(name)) return '/vendors/spark.png';

  return '/vendors/tongyong.png';
}

/**
 * 根据模型名称获取对应的厂家名称
 * @param {string} modelName
 * @returns {string} 厂家名称
 */
export function getVendorName(modelName) {
  if (!modelName) return '未知';
  const name = modelName.toLowerCase();

  // 文心一言专属匹配
  if (/wenxin|ernie|文心|yiyan/.test(name)) return '文心一言';

  // 按模型名特征匹配
  if (/gpt|openai|dall[ -]?e|whisper/.test(name)) return 'OpenAI';
  if (/claude|anthropic/.test(name)) return 'Anthropic';
  if (/gemini|palm|google/.test(name)) return 'Google';
  if (/mistral|mixtral/.test(name)) return 'Mistral';
  if (/command[-_ ]?r|cohere/.test(name)) return 'Cohere';
  if (/llama|huggingface|hf-/.test(name)) return 'Hugging Face';
  if (/ollama/.test(name)) return 'Ollama';
  if (/qianfan|ernie|baidu/.test(name)) return '千帆';
  if (/tongyi|qwen|dashscope|ali|alibaba/.test(name)) return '通义';
  if (/deepseek/.test(name)) return 'DeepSeek';
  if (/moonshot/.test(name)) return 'Moonshot';
  if (/yi[-_ ]?\d|zhipu|glm|chatglm/.test(name)) return '智谱';
  if (/spark|xinghuo|iflytek|讯飞/.test(name)) return '讯飞';

  // fallback: 按厂商品牌名再匹配一次
  if (/openai/.test(name)) return 'OpenAI';
  if (/anthropic/.test(name)) return 'Anthropic';
  if (/google/.test(name)) return 'Google';
  if (/mistral/.test(name)) return 'Mistral';
  if (/cohere/.test(name)) return 'Cohere';
  if (/huggingface/.test(name)) return 'Hugging Face';
  if (/ollama/.test(name)) return 'Ollama';
  if (/qianfan|baidu/.test(name)) return '千帆';
  if (/tongyi|ali|alibaba/.test(name)) return '通义';
  if (/deepseek/.test(name)) return 'DeepSeek';
  if (/moonshot/.test(name)) return 'Moonshot';
  if (/zhipu/.test(name)) return '智谱';
  if (/spark|iflytek|讯飞/.test(name)) return '讯飞';

  return '未知';
}