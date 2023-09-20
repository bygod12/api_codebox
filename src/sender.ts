import {create, Message, Whatsapp} from 'venom-bot';

const axios = require('axios');

class Sender {
    private id?: bigint;
    private uid?: bigint;
    private numero?:bigint;
    private cliente?: Whatsapp;
    private qrCodeImage?: string;

    constructor() {
        this.initialize();
    }

    async sendText(to: string, body: string) {
        let too=to;
        to = to+"@c.us"
        this.cliente!
            .sendText(to, body)
            .then((result) => {
                 this.getMessagesByPhoneNumber(too).then((r)=>{
                     return r;
                }).catch((e)=>{
                console.log(e);
                }); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });

    }

    async getAllChats() {


        return this.cliente?.getAllChats();

    }

    async getChatGroupNewMsg() {
        return this.cliente?.getChatGroupNewMsg();
    }

    async getAllChatsContacts() {
        return this.cliente?.getAllChatsContacts();
    }

    async getChatContactNewMsg() {
        return this.cliente?.getChatContactNewMsg();
    }

    getQRCodeImage() {
        return this.qrCodeImage;
    }







    async getMessagesByPhoneNumber(phoneNumber: string): Promise<Message[]> {
        const chatId = phoneNumber + '@c.us';
        const includeMe = true;
        const includeNotifications = true;
        const messages = await this.cliente?.getAllMessagesInChat(chatId, includeMe, includeNotifications);
        return messages || [];
    }


    async initialize() {

        const qr = (base64Qrimg: string) => {
            console.log('QR Code gerado!');
            this.qrCodeImage = base64Qrimg;
        };

        const status = (sessionStatus: string, sessionData: any) => {
            console.log('Status da sessão:', sessionStatus);
        };

        const onMessage = (message: Message) => {
            console.log('Nova mensagem recebida:', message.body);
            // Faça o que você precisa com a mensagem aqui
        };

        const start = async (cliente: Whatsapp) => {
            this.cliente = cliente;


            console.log('começou')

            // Você pode adicionar outras ações que deseja realizar aqui
        };

        create('departamento_01', qr, status)
            .then((cliente) => start(cliente))
            .catch((error) => console.error(error));
    }
    async getContactByPhoneNumber(phoneNumber: string): Promise<any> {
        const chatId = phoneNumber + '@c.us';
        return this.cliente?.getContact(chatId);
    }

}

export default Sender;
