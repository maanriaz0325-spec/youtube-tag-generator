module.exports = async function handler(req: any, res: any) {
  res.json({ status: "working", key: !!process.env.GEMINI_API_KEY });
};