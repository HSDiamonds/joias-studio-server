const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer();

app.use(cors());

app.post('/remove-bg', upload.single('image_file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('image_file', req.file.buffer, {
      filename: 'image.jpg',
      contentType: req.file.mimetype
    });
    form.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'n7Y6GWmkc69D3szpzye7iP7j',
        ...form.getHeaders()
      },
      body: form
    });

    const buffer = await response.buffer();
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
