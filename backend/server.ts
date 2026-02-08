import express, { Request, Response } from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { Post, ForumComment, User } from '../src/components/types'
interface PostDB {
    id: number;
    title: string;
    authorId: number;
    content: string[];
    createdAt: string;
    comments: ForumCommentDB[];
}

interface ForumCommentDB {
    id: number;
    text: string;
    authorId: number;
    createdAt: string;
}

interface DBStructure {
    posts: PostDB[];
    users: User[];
}

const server = express()
const PORT = 5000
const DB_PATH = path.join(__dirname, 'db.json')

server.use(cors())
server.use(express.json())

async function readDB(): Promise<DBStructure> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        const db = JSON.parse(data);
        return {
            posts: db.posts || [],
            users: db.users || []
        };
    } catch (error) {
        return { posts: [], users: [] };
    }
}

async function writeDB(db: DBStructure): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

server.use(express.json({
    limit: '50mb',
    strict: false
}));

server.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));
server.get('/api/posts', async (req: Request, res: Response) => {
    try {
        const db = await readDB();

        const enrichedPosts = db.posts.map((post: PostDB) => {
            const author = db.users.find((u: User) => u.id === post.authorId);
            const enrichedComments = (post.comments || []).map(c => {
                const cAuthor = db.users.find(u => u.id === c.authorId);
                return {
                    ...c,
                    author: cAuthor || { id: 0, username: "Гість", role: "student", profilePicUrl: "" }
                };
            });

            return {
                ...post,
                author: author || { id: 0, username: "Гість", role: "student", profilePicUrl: "" },
                comments: enrichedComments
            };
        });

        res.json(enrichedPosts);
    } catch (err) {
        res.status(500).json({ error: "Помилка сервера" });
    }
});

server.get('/api/users/:id', async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const db = await readDB();

    const userPosts = db.posts.filter(p => p.authorId === userId);
    const userInfo = db.users.find(u => u.id === userId);

    let commentCount = 0;
    db.posts.forEach(p => {
        const userComments = p.comments.filter(c => c.authorId === userId);
        commentCount += userComments.length;
    });

    res.json({
        ...(userInfo || { username: 'Користувач', id: userId }),
        stats: {
            posts: userPosts.length,
            comments: commentCount
        }
    });
});


server.post('/api/posts/:id/comments', async (req: Request, res: Response) => {
    const postId = Number(req.params.id);
    const db = await readDB();
    const postIndex = db.posts.findIndex(p => p.id === postId);

    if (postIndex > -1) {
        const newComment: ForumCommentDB = {
            id: Date.now(),
            text: req.body.text,
            authorId: req.body.authorId || req.body.author?.id,
            createdAt: new Date().toLocaleString()
        };

        db.posts[postIndex].comments.push(newComment);
        await writeDB(db);
        res.status(201).json(newComment);
    } else {
        res.status(404).json({ message: 'Пост не знайдено' });
    }
});


server.patch('/api/users/:id', async (req, res) => {
    const targetId = Number(req.params.id);
    const { profilePicUrl, username, requesterId } = req.body;
    if (targetId !== Number(requesterId)) {
        return res.status(403).json({ message: "Ви не можете редагувати чужий профіль!" });
    }
    let db = await readDB();
    const userIndex = db.users.findIndex(u => u.id === targetId);

    if (userIndex !== -1) {
        if (profilePicUrl) db.users[userIndex].profilePicUrl = profilePicUrl;
        if (username) db.users[userIndex].username = username;
        await writeDB(db);
        res.json(db.users[userIndex]);
    } else {
        res.status(404).send('Користувача не знайдено');
    }
});


server.delete('/api/posts/:id', async (req: Request, res: Response) => {
    const postId = Number(req.params.id);
    let db = await readDB();

    if (db.posts.some(p => p.id === postId)) {
        db.posts = db.posts.filter(p => p.id !== postId);
        await writeDB(db);
        res.status(200).json({ message: 'Пост видалено' });
    } else {
        res.status(404).json({ message: 'Пост не знайдено' });
    }
});


server.delete('/api/posts/:postId/comments/:commentId', async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    let db = await readDB();
    const postIndex = db.posts.findIndex(p => p.id === Number(postId));

    if (postIndex > -1) {
        db.posts[postIndex].comments = db.posts[postIndex].comments.filter(
            c => c.id !== Number(commentId)
        );
        await writeDB(db);
        res.status(200).json({ message: 'Коментар видалено' });
    } else {
        res.status(404).json({ message: 'Пост не знайдено' });
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/api/posts`)
});