import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let db: any;
let isPostgres = false;

const defaultConfig = {
  branding: {
    brandName: "Mr Burger",
    tagline: "Delicious burgers, fast delivery, always fresh!",
    logoUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=100",
    faviconUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=32"
  },
  hero: {
    ctaText: "Order Now",
    ctaLink: "https://api.whatsapp.com/send?phone=213558620107",
    bgImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1920"
  },
  about: {
    story: "At Mr Burger, we believe in fresh ingredients, fast service, and the best taste in Constantine. Our goal is to satisfy every burger lover with quality and speed.",
    values: [
      "Fresh, high-quality ingredients",
      "Fast delivery and service",
      "Affordable prices",
      "Friendly staff"
    ],
    showTestimonials: true,
    testimonials: [
      { id: 1, name: "Ahmed B.", comment: "Best burgers in town! Fast delivery and amazing taste.", rating: 5, image: "https://i.pravatar.cc/150?u=ahmed" },
      { id: 2, name: "Sara T.", comment: "I love Mr Burger’s combos, great value for money.", rating: 5, image: "https://i.pravatar.cc/150?u=sara" }
    ]
  },
  promotion: {
    show: true,
    title: "Combo of the Week",
    description: "Get any burger with fries and a drink for only 1500 DZD!",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800",
    startDate: "2026-03-01",
    endDate: "2026-03-07",
    ctaText: "Order Now",
    ctaLink: "https://api.whatsapp.com/send?phone=213558620107"
  },
  contact: {
    whatsapp: "https://api.whatsapp.com/send?phone=213558620107",
    phone: "+213 558 62 01 07",
    email: "info@mrburger.dz",
    address: "123 Main Street, Constantine, Algeria",
    mapsCoords: "36.3650,6.6147",
    socials: {
      instagram: "https://instagram.com/mrburger",
      facebook: "https://facebook.com/mrburger",
      tiktok: "https://tiktok.com/@mrburger"
    }
  },
  menu: [
    { id: 1, category: "Burger", name: "Classic Cheeseburger", description: "Juicy beef patty with cheddar, lettuce, tomato", price: 1200, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800" },
    { id: 2, category: "Burger", name: "Double Bacon Burger", description: "Double beef, crispy bacon, special sauce", price: 1600, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=800" },
    { id: 3, category: "Burger", name: "Veggie Delight", description: "Grilled veggies, fresh lettuce, tomato", price: 1000, image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&q=80&w=800" },
    { id: 4, category: "Side", name: "French Fries", description: "Crispy golden fries", price: 500, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800" },
    { id: 5, category: "Side", name: "Onion Rings", description: "Crispy battered onion rings", price: 600, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=800" },
    { id: 6, category: "Drink", name: "Cola", description: "330ml chilled soda", price: 200, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800" },
    { id: 7, category: "Drink", name: "Fresh Juice", description: "Orange or mango freshly squeezed", price: 400, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800" },
    { id: 8, category: "Combo", name: "Burger + Fries + Drink", description: "Any burger + fries + drink", price: 1700, image: "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?auto=format&fit=crop&q=80&w=800" }
  ]
};

async function getDb() {
  if (db) return db;

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    const pool = new pg.Pool({ connectionString: dbUrl });
    await pool.query(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
    
    const res = await pool.query("SELECT value FROM config WHERE key = 'site_config'");
    if (res.rows.length === 0) {
      await pool.query("INSERT INTO config (key, value) VALUES ($1, $2)", ['site_config', JSON.stringify(defaultConfig)]);
    }
    
    db = pool;
    isPostgres = true;
    return db;
  }
  
  try {
    const { default: Database } = await import("better-sqlite3");
    const dbPath = path.join(process.cwd(), "mrburger.db");
    db = new Database(dbPath);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    const existing = db.prepare("SELECT * FROM config WHERE key = 'site_config'").get();
    if (!existing) {
      db.prepare("INSERT INTO config (key, value) VALUES (?, ?)").run('site_config', JSON.stringify(defaultConfig));
    }
    
    isPostgres = false;
    return db;
  } catch (e) {
    console.error("Database initialization failed:", e);
    throw new Error("Database not available. Please check your environment variables.");
  }
}

async function createServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  app.get("/api/config", async (req, res) => {
    try {
      const database = await getDb();
      let value;
      if (isPostgres) {
        const result = await database.query("SELECT value FROM config WHERE key = 'site_config'");
        value = result.rows[0]?.value;
      } else {
        const row = database.prepare("SELECT value FROM config WHERE key = 'site_config'").get();
        value = row?.value;
      }
      
      if (!value) return res.status(404).json({ error: "Config not found" });
      res.json(JSON.parse(value));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/config", async (req, res) => {
    try {
      const database = await getDb();
      const newConfig = JSON.stringify(req.body);
      if (isPostgres) {
        await database.query("UPDATE config SET value = $1 WHERE key = 'site_config'", [newConfig]);
      } else {
        database.prepare("UPDATE config SET value = ? WHERE key = 'site_config'").run(newConfig);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Not Found");
      }
    });
  }

  return { app, PORT };
}

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  createServer().then(({ app, PORT }) => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

let vercelApp: any;
export default async (req: any, res: any) => {
  if (!vercelApp) {
    const result = await createServer();
    vercelApp = result.app;
  }
  return vercelApp(req, res);
};
