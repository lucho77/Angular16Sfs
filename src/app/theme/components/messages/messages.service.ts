import { Injectable } from '@angular/core'

@Injectable()
export class MessagesService {

    private usuarios = [
        {
            name: 'Gustavo',
            idSession: 1334
        },
        {
            name: 'Ashley',
            idSession: 1111
        },
        {
            name: 'Michael',
            idSession: 1112
        },
        {
            name: 'Julia',
            idSession: 1113
        },
        {
            name: 'Bruno',
            idSession: 1114
        },
        {
            name: 'Tereza',
            idSession: 1115
        },
        {
            name: 'Adam',
            idSession: 1116
        },
        {
            name: 'Augusto',
            idSession: 1117
        },
        {
            name: 'Luciano',
            idSession: 1121
        },
        {
            name: 'Luciano oroño',
            idSession: 1124
        },
        {
            name: 'Emiliano',
            idSession: 1122
        },
        {
            name: 'Gustavo L',
            idSession: 1222
        },
        {
            name: 'Gustavo S',
            idSession: 1141
        },
        {
            name: 'Nicolas',
            idSession: 1142
        }
    ]
    private messages = [
        {
            name: 'Ashley',
            text: 'After you get up and running, you can place Font Awesome icons just about...',
            time: 3,
            enviado: false,
            idSession: 1111,
            leido: true
        },
        {
            name: 'Ashley',
            text: 'Test Test Test Test Test Test Test Test Test Test Test Test Test Test ',
            time: 2,
            enviado: false,
            idSession: 1111,
            leido: true
        },
        {
            name: 'Ashley',
            text: 'lorem ipsum',
            time: 2,
            enviado: false,
            idSession: 1111,
            leido: true
        },
        {
            name: 'Ashley',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            time: 1,
            enviado: false,
            idSession: 1111,
            leido: false
        },
        {
            name: 'Ashley',
            text: 'But I must explain to you how all this mistaken idea of denouncing pleasure...',
            time: 3,
            enviado: false,
            idSession: 1111,
            leido: true
        },
        {
            name: 'Ashley',
            text: 'because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. ',
            time: 4,
            enviado: false,
            idSession: 1111,
            leido: true
        },
        {
            name: 'Ashley',
            text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
            time: 43,
            enviado: false,
            idSession: 1111,
            leido: true
        },
        {
            name: 'Michael',
            text: 'You asked, Font Awesome delivers with 40 shiny new icons in version 4.2.',
            time: 51,
            enviado: false,
            idSession: 1112,
            leido: true
        },
        {
            name: 'Julia',
            text: 'Want to request new icons? Here\'s how. Need vectors or want to use on the...',
            time: 11,
            enviado: false,
            idSession: 1113,
            leido: true
        },
        {
            name: 'Bruno',
            text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
            time: 2,
            enviado: false,
            idSession: 1114,
            leido: false
        },
        {
            name: 'Tereza',
            text: 'Get to know who we are - from the inside out. From our history and culture, to the...',
            time: 31,
            enviado: false,
            idSession: 1115,
            leido: true
        },
        {
            name: 'Adam',
            text: 'Need some support to reach your goals? Apply for scholarships across a variety of...',
            time: 82,
            enviado: false,
            idSession: 1116,
            leido: true
        },
        {
            name: 'Augusto',
            text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
            time: 9,
            enviado: false,
            idSession: 1117,
            leido: true
        },
        {
            name: 'Bruno',
            text: 'because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.',
            time: 0,
            enviado: true,
            idSession: 1111,
            leido: true
        },
        {
            name: 'Bruno',
            text: 'Esto es un mensaje enviado 2',
            time: 1,
            enviado: true,
            idSession: 1112,
            leido: true
        },
        {
            name: 'Bruno',
            text: 'Esto es un mensaje enviado 2',
            time: 2,
            enviado: true,
            idSession: 1111,
            leido: true
        },
        {
            name: 'Luciano',
            text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
            time: 1,
            enviado: false,
            idSession: 1121,
            leido: true
        },
        {
            name: 'Emiliano',
            text: 'Hola muy buenas',
            time: 5,
            enviado: false,
            idSession: 1122,
            leido: true
        },
        {
            name: 'Bruno',
            text: 'Sos gay?',
            time: 3,
            enviado: true,
            idSession: 1122,
            leido: true
        },
        {
            name: 'Emiliano',
            text: 'Si',
            time: 1,
            enviado: false,
            idSession: 1122,
            leido: true
        },
        {
            name: 'Nicolas',
            text: 'Terminame la web daleeeee',
            time: 55,
            enviado: false,
            idSession: 1142,
            leido: true
        }
    ];

    private meetings = [
        {
            day: '09',
            month: 'May',
            title: 'Meeting with Bruno',
            text: 'Fusce ut condimentum velit, quis egestas eros. Quisque sed condimentum neque.',
            time: 3
        },
        {
            day: '15',
            month: 'May',
            title: 'Training course',
            text: 'Fusce arcu tortor, tempor aliquam augue vel, consectetur vehicula lectus.',
            time: 2
        },
        {
            day: '12',
            month: 'June',
            title: 'Dinner with Ashley',
            text: 'Curabitur rhoncus facilisis augue sed fringilla.',
            time: 1
        },
        {
            day: '14',
            month: 'June',
            title: 'Sport time',
            text: 'Vivamus tristique enim eros, ac ultricies sem ultrices vitae.',
            time: 5
        },
        {
            day: '29',
            month: 'July',
            title: 'Birthday of Julia',
            text: 'Nam porttitor justo nec elit efficitur vestibulum.',
            time: 4
        }
    ];

    public getMessages(): Array<Object> {
        return this.messages;
    }

    public getMeetings(): Array<Object> {
        return this.meetings;
    }

    public getUsuarios(): Array<Object> {
        return this.usuarios;
    }

}