require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET;

// Rota para gerar token
app.post("/api/gerarToken", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Usuário obrigatório" });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Rota protegida (exemplo)
app.get("/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Acesso permitido", user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
