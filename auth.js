export default async function handler(req, res) {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        return res.status(200).json({ success: true, token: process.env.ADMIN_TOKEN });
    } else {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}
