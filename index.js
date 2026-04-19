const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Jóias Studio Server funcionando!');
});

app.post('/remove-bg', upload.single('image'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('image_file', req.file.buffer, {
      filename: 'image.jpg',
      contentType: req.file.mimetype
    });
    form.append('size', 'auto');

    const response = await fetch('https://background-removal-ai.p.rapidapi.com/remove-background', {
      method: 'POST',
      headers: {
        'x-rapidapi-host': 'background-removal-ai.p.rapidapi.com',
        'x-rapidapi-key': '066563ff90mshfb600f9a67a203bp1d1177jsnee39d8700fa9',
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const buffer = await response.buffer();
    res.set('Content-Type', 'image/png');
    res.send(buffer);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
