import express, { Request, Response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
    id: number;
    username: string;
    profilePicUrl: string;
    role: UserRole;
    email?: string;
    password?: string;
}

export interface ForumComment {
    id: number;
    postid: number;
    author: User;
    text: string;
    createdAt: string;
    replies: ForumComment[];
}

export interface Post {
    id: number;
    title: string;
    author: User;
    content: string[];
    comments: ForumComment[];
    createdAt: string;
}

const server = express();
const PORT = Number(process.env.PORT) || 5000;

server.use(cors({
    origin: 'https://my-forum-site.vercel.app',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ariflame:p6hV03LktWY66yfw@dbbackend0.uwwvylh.mongodb.net/?appName=DBbackend0";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const UserSchema = new mongoose.Schema<User>({
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    profilePicUrl: { type: String, default: "" },
    role: { type: String, default: 'student' },
    email: String,
    password: { type: String, required: true }
});

const PostSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    authorId: { type: Number, required: true },
    content: [String],
    createdAt: { type: String, default: () => new Date().toLocaleString() },
    comments: [{
        id: Number,
        text: String,
        authorId: Number,
        createdAt: { type: String, default: () => new Date().toLocaleString() }
    }]
});

const UserModel = mongoose.model<User>('User', UserSchema);
const PostModel = mongoose.model('Post', PostSchema);

server.get('/api/posts', async (req: Request, res: Response) => {
    try {
        const [rawPosts, users] = await Promise.all([
            PostModel.find().sort({ _id: -1 }).lean(),
            UserModel.find().lean()
        ]);

        const guestUser: User = {
            id: 0,
            username: "Гість",
            role: "student",
            profilePicUrl: ""
        };

        const enrichedPosts = rawPosts.map(post => {
            const author = users.find(u => Number(u.id) === Number(post.authorId));

            return {
                ...post,
                id: post.id || post._id,
                author: author || guestUser,
                comments: (post.comments || []).map(c => ({
                    ...c,
                    author: users.find(u => Number(u.id) === Number(c.authorId)) || guestUser,
                    replies: [] as ForumComment[]
                }))
            };
        });

        res.json(enrichedPosts);
    } catch (err) {
        console.error("Помилка завантаження стрічки:", err);
        res.status(500).json({ error: "Не вдалося завантажити пости" });
    }
});
server.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const userInfo = await UserModel.findOne({ id: userId }).lean();

        if (!userInfo) return res.status(404).json({ message: "Користувача не знайдено" });

        const allPosts = await PostModel.find().lean();
        const userPosts = allPosts.filter(p => p.authorId === userId);
        let commentCount = 0;
        allPosts.forEach(p => {
            commentCount += (p.comments || []).filter(c => c.authorId === userId).length;
        });

        res.json({
            ...userInfo,
            stats: { posts: userPosts.length, comments: commentCount }
        });
    } catch (err) {
        res.status(500).json({ error: "Помилка завантаження профілю" });
    }
});

server.post('/api/posts/:id/comments', async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const newComment = {
            id: Date.now(),
            text: req.body.text,
            authorId: Number(req.body.authorId || req.body.author?.id),
            createdAt: new Date().toLocaleString()
        };

        const post = await PostModel.findOneAndUpdate(
            { id: postId },
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!post) return res.status(404).json({ message: 'Пост не знайдено' });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: "Помилка коментаря" });
    }
});
server.post('/api/posts', async (req: Request, res: Response) => {
    try {
        const { title, content, authorId, author } = req.body;
        const finalAuthorID = authorId || (author && author.id);
        if (!finalAuthorID) {
            return res.status(404).json({ error: "Invalid ID!" })
        }
        const newPost = new PostModel({
            id: Date.now(),
            title,
            content: Array.isArray(content) ? content : [content],
            authorId: Number(finalAuthorID),
            createdAt: new Date().toLocaleDateString('uk-UA'),
            comments: [] as ForumComment[]
        })
        await newPost.save()
        res.status(201).json(newPost)
    } catch (err) {
        console.error("Помилка створення поста", err)
        res.status(500).json({ error: "Не вдалося зберегти пост" })
    }
})

server.patch('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const targetId = Number(req.params.id);
        const { profilePicUrl, username, requesterId } = req.body;

        if (targetId !== Number(requesterId)) {
            return res.status(403).json({ message: "Доступ заборонено" });
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { id: targetId },
            { $set: { profilePicUrl, username } },
            { new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Помилка оновлення" });
    }
});

server.post('/api/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password, profilePicUrl, role } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ error: "Відсутні обов'язкові поля: email, password або username" });
        }

        const newUser = new UserModel({
            id: Date.now(),
            username,
            email,
            password,
            profilePicUrl: profilePicUrl || "",
            role: role || 'student'
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err: any) {
        console.error("Помилка БД:", err);
        if (err.code === 11000) {
            return res.status(400).json({ error: "Користувач з таким email вже існує" });
        }
        res.status(500).json({ error: "Помилка реєстрації на сервері" });
    }
});

server.post('/api/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email, password }).lean();

        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ message: "Невірний email або пароль" });
        }
    } catch (err) {
        console.error("Помилка логіну:", err);
        res.status(500).json({ error: "Помилка сервера при вході" });
    }
});

server.delete('/api/posts/:id', async (req: Request, res: Response) => {
    try {
        await PostModel.deleteOne({ id: Number(req.params.id) });
        res.status(200).json({ message: 'Пост видалено' });
    } catch (err) {
        res.status(500).json({ error: "Помилка видалення" });
    }
});

server.delete('/api/posts/:postId/comments/:commentId', async (req: Request, res: Response) => {
    try {
        const { postId, commentId } = req.params;
        await PostModel.findOneAndUpdate(
            { id: Number(postId) },
            { $pull: { comments: { id: Number(commentId) } } }
        );
        res.status(200).json({ message: 'Коментар видалено' });
    } catch (err) {
        res.status(500).json({ error: "Помилка видалення коментаря" });
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Server live on port ${PORT}`);
});