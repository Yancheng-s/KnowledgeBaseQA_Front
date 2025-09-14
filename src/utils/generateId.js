const existingIds = new Set(); // 用于存储已生成的 ID

export const generateUniqueIntId = (min = 1000000000, max = 9999999999) => {
  let newId;
  do {
    newId = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (existingIds.has(newId)); // 如果 ID 已存在，则重新生成
  existingIds.add(newId); // 将新生成的 ID 添加到集合中
  return newId;
};