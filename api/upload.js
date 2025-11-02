export default async function handler(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    // For now, just return success (no actual file saving)
    res.status(200).json({ success: true, url: '/example.jpg' });
}
