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
    form.append('background_color', 'ffffff');

    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': 'sk_pr_default_db76558215b16b55a97dc0854ac7f283b94ace78',
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
