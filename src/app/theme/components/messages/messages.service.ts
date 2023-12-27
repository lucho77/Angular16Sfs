import {Injectable} from '@angular/core'

@Injectable()
export class MessagesService {

    private usuarios = [
        {
            name: 'ashley',
            idSession: 1111
        },
        {
            name: 'michael',
            idSession: 1112
        },
        {
            name: 'julia',
            idSession: 1113
        },
        {
            name: 'bruno',
            idSession: 1114
        },
        {
            name: 'tereza',
            idSession: 1115
        },
        {
            name: 'adam',
            idSession: 1116
        },
        {
            name: 'michael',
            idSession: 1117
        },
        {
            name: 'Lucho',
            idSession: 1121
        }
    ]
    private messages = [
        {
            name: 'ashley',
            text: 'After you get up and running, you can place Font Awesome icons just about...',
            time: 1,
            enviado:false,
            idSession: 1111
        },
        {
            name: 'ashley',
            text: 'Test Test Test Test Test Test Test Test Test Test Test Test Test Test ',
            time: 1,
            enviado:false,
            idSession: 1111
        },
        {
            name: 'ashley',
            text: 'lorem ipsum',
            time: 2,
            enviado:false,
            idSession: 1111
        },
        {
            name: 'ashley',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            time: 2,
            enviado:false,
            idSession: 1111
        },
        {
            name: 'ashley',
            text: 'But I must explain to you how all this mistaken idea of denouncing pleasure...',
            time: 3,
            enviado:false,
            idSession: 1111
        },
        {
            name: 'ashley',
            text: 'because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. ',
            time: 4,
            enviado:false,
            idSession: 1111
        },
        {
            name: 'ashley',
            text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
            time: 43,
            enviado:false,
            idSession: 1111
        },
        {
            name: 'michael',
            text: 'You asked, Font Awesome delivers with 40 shiny new icons in version 4.2.',
            time: 51,
            enviado:false,
            idSession: 1112
        },
        {
            name: 'julia',
            text: 'Want to request new icons? Here\'s how. Need vectors or want to use on the...',
            time: 11,
            enviado:false,
            idSession: 1113
        },
        {
            name: 'bruno',
            text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
            time: 2,
            enviado:false,
            idSession: 1114
        },
        {
            name: 'tereza',
            text: 'Get to know who we are - from the inside out. From our history and culture, to the...',
            time: 31,
            enviado:false,
            idSession: 1115
        },
        {
            name: 'adam',
            text: 'Need some support to reach your goals? Apply for scholarships across a variety of...',
            time: 82,
            enviado:false,
            idSession: 1116
        },
        {
            name: 'michael',
            text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
            time: 9,
            enviado:false,
            idSession: 1117
        },
        {
            name: 'Bruno',
            text: 'because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.',
            time: 0,
            enviado:true,
            idSession: 1111
        },
        {
            name: 'Bruno',
            text: 'Esto es un mensaje enviado 2',
            time: 1,
            enviado:true,
            idSession: 1112
        },
        {
            name: 'Bruno',
            text: 'Esto es un mensaje enviado 2',
            time: 2,
            enviado:true,
            idSession: 1111
        }
    ];

    private meetings = [
        {
            day: '09',
            month: 'May',
            title: 'Meeting with Bruno',
            text: 'Fusce ut condimentum velit, quis egestas eros. Quisque sed condimentum neque.',
            color: 'danger'
        },       
        {
            day: '15',
            month: 'May',
            title: 'Training course',
            text: 'Fusce arcu tortor, tempor aliquam augue vel, consectetur vehicula lectus.',
            color: 'primary'
        },
        {
            day: '12',
            month: 'June',
            title: 'Dinner with Ashley',
            text: 'Curabitur rhoncus facilisis augue sed fringilla.',
            color: 'info'
        },
        {
            day: '14',
            month: 'June',
            title: 'Sport time',
            text: 'Vivamus tristique enim eros, ac ultricies sem ultrices vitae.',
            color: 'warning'
        },
        {
            day: '29',
            month: 'July',
            title: 'Birthday of Julia',
            text: 'Nam porttitor justo nec elit efficitur vestibulum.',
            color:'success'
        }
    ];

    public getMessages():Array<Object> {
        return this.messages;
    }

    public getMeetings():Array<Object> {
        return this.meetings;
    }

    public getUsuarios(): Array<Object>{
        return this.usuarios;
    }

}