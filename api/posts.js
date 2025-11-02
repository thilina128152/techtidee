import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data.json');

export default async function handler(req, res) {
    // GET → return all posts
    if (req.method === 'GET') {
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
        const data = fs.readFileSync(filePath);
        return res.status(200).json(JSON.parse(data));
    }

    // POST → add a new post
    if (req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1];
        if (token !== process.env.ADMIN_TOKEN) return res.status(401).json({ message: 'Invalid token' });

        const { title, description, imageUrl } = req.body;

        if (!title || !imageUrl) return res.status(400).json({ message: 'Missing fields' });

        let posts = [];
        if (fs.existsSync(filePath)) {
            posts = JSON.parse(fs.readFileSync(filePath));
        }

        const newPost = {
            id: Date.now(),
            title,
            description,
            imageUrl,
        };

        posts.unshift(newPost);
        fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

        return res.status(201).json({ message: 'Post added successfully', post: newPost });
    }

    // DELETE → delete post by ID
    if (req.method === 'DELETE') {
        const token = req.headers.authorization?.split(' ')[1];
        if (token !== process.env.ADMIN_TOKEN) return res.status(401).json({ message: 'Invalid token' });

        const { id } = req.query;
        if (!id) return res.status(400).json({ message: 'Missing post ID' });

        let posts = [];
        if (fs.existsSync(filePath)) {
            posts = JSON.parse(fs.readFileSync(filePath));
        }

        const filtered = posts.filter(p => p.id != id);
        fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));

        return res.status(200).json({ message: 'Post deleted successfully' });
    }

    res.status(405).json({ message: 'Method not allowed' });
}
