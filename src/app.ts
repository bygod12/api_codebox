const express = require('express');
import Sender from './sender';

const app = express();
const port = 3000;

const sender = new Sender();

app.use((req:any, res:any, next:any) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4201');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/chats', async (req:any, res:any) => {
    sender.getAllChats().then(r=>{
        res.json(r);
    }).catch(e=>{
        console.log(e);
    })

});

app.post('/messages/send', async (req:any, res:any) => {
    const { to, body } = req.body;
    let mensage;
    try {
        mensage = sender.sendText(to, body);
        console.log(mensage);
        res.send(mensage);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erro ao enviar mensagem de texto.'});
    }
});


app.get('/messages/:chatId', async (req:any, res:any) => {
    const chatId = req.params.chatId;
    try {
        const messages = await sender.getMessagesByPhoneNumber(chatId);
        res.send(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Erro ao obter mensagens.' });
    }
});

app.get('/chats/new-messages', async (req:any, res:any) => {
    const allChatsNewMsg = await sender.getChatGroupNewMsg();
    res.json(allChatsNewMsg);
});

app.get('/chats/contacts', async (req:any, res:any) => {
    const allChatsContacts = await sender.getAllChatsContacts();
    res.json(allChatsContacts);
});

app.get('/chats/contact-new-messages', async (req:any, res:any) => {
    const chatContactNewMsg = await sender.getChatContactNewMsg();
    res.json(chatContactNewMsg);
});

app.get('/qrcode', (req:any, res:any) => {
    const qrCodeImage = sender.getQRCodeImage();
    res.setHeader('Content-Type', 'image/png');
    res.send(qrCodeImage);
});

app.get('/contacts', async (req: any, res: any) => {
    const phoneNumber = req.query.phoneNumber;
    try {
        const contact = await sender.getContactByPhoneNumber(phoneNumber);
        res.json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Erro ao obter contato.' });
    }
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
