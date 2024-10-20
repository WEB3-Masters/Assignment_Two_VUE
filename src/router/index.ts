import {createRouter, createWebHistory} from 'vue-router';
import UnoGameSetup from '../components/UnoGameSetup.vue';
import UnoGamePlay from '../components/UnoGamePlay.vue';
import UnoGameBreak from '../components/UnoGameBreak.vue';
import UnoGameOver from '../components/UnoGameOver.vue';

const routes = [
    {   
        path: '/', 
        name:'Setup', 
        component:UnoGameSetup
    },
    {   path:'/game',
        name:'Game', 
        component:UnoGamePlay, 
    },
    {   path:'/game/break',
        name:'Break', 
        component:UnoGameBreak, 
    },
    {  path:'/game/over',name:'End', 
        component:UnoGameOver, 
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;