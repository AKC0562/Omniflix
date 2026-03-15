import type { AlienAvatarInfo, AlienAvatar } from '../types';

export const ALIEN_AVATARS: AlienAvatarInfo[] = [
  { id: 'heatblast', name: 'Heatblast', color: '#FF6D00', glowColor: 'rgba(255,109,0,0.6)', emoji: '🔥', description: 'The fiery Pyronite from planet Pyros' },
  { id: 'fourarms', name: 'Four Arms', color: '#D32F2F', glowColor: 'rgba(211,47,47,0.6)', emoji: '💪', description: 'The mighty Tetramand warrior' },
  { id: 'xlr8', name: 'XLR8', color: '#00BCD4', glowColor: 'rgba(0,188,212,0.6)', emoji: '⚡', description: 'The supersonic Kineceleran speedster' },
  { id: 'diamondhead', name: 'Diamondhead', color: '#00E676', glowColor: 'rgba(0,230,118,0.6)', emoji: '💎', description: 'The crystalline Petrosapien defender' },
  { id: 'upgrade', name: 'Upgrade', color: '#00FF41', glowColor: 'rgba(0,255,65,0.6)', emoji: '🤖', description: 'The tech-merging Galvanic Mechamorph' },
  { id: 'ghostfreak', name: 'Ghostfreak', color: '#9E9E9E', glowColor: 'rgba(158,158,158,0.6)', emoji: '👻', description: 'The ghostly Ectonurite phantom' },
  { id: 'ripjaws', name: 'Ripjaws', color: '#0277BD', glowColor: 'rgba(2,119,189,0.6)', emoji: '🦈', description: 'The aquatic Piscciss Volann predator' },
  { id: 'stinkfly', name: 'Stinkfly', color: '#7CB342', glowColor: 'rgba(124,179,66,0.6)', emoji: '🪰', description: 'The insectoid Lepidopterran flyer' },
  { id: 'wildmutt', name: 'Wildmutt', color: '#E65100', glowColor: 'rgba(230,81,0,0.6)', emoji: '🐾', description: 'The feral Vulpimancer tracker' },
  { id: 'greymatter', name: 'Grey Matter', color: '#B0BEC5', glowColor: 'rgba(176,190,197,0.6)', emoji: '🧠', description: 'The genius Galvan micro-being' },
  { id: 'cannonbolt', name: 'Cannonbolt', color: '#FDD835', glowColor: 'rgba(253,216,53,0.6)', emoji: '🔮', description: 'The armored Arburian Pelarota roller' },
  { id: 'wildvine', name: 'Wildvine', color: '#2E7D32', glowColor: 'rgba(46,125,50,0.6)', emoji: '🌿', description: 'The plant-based Florauna warrior' },
  { id: 'swampfire', name: 'Swampfire', color: '#F57C00', glowColor: 'rgba(245,124,0,0.6)', emoji: '🌋', description: 'The fire-plant hybrid Methanosian' },
  { id: 'echo_echo', name: 'Echo Echo', color: '#42A5F5', glowColor: 'rgba(66,165,245,0.6)', emoji: '🔊', description: 'The sonic duplicating Sonorosian' },
  { id: 'humungousaur', name: 'Humungousaur', color: '#795548', glowColor: 'rgba(121,85,72,0.6)', emoji: '🦕', description: 'The gigantic Vaxasaurian titan' },
  { id: 'jetray', name: 'Jetray', color: '#E53935', glowColor: 'rgba(229,57,53,0.6)', emoji: '🦅', description: 'The aerial Aerophibian ray-flyer' },
  { id: 'big_chill', name: 'Big Chill', color: '#29B6F6', glowColor: 'rgba(41,182,246,0.6)', emoji: '❄️', description: 'The ice-moth Necrofriggian' },
  { id: 'chromastone', name: 'Chromastone', color: '#AB47BC', glowColor: 'rgba(171,71,188,0.6)', emoji: '🌈', description: 'The energy-absorbing Crystalsapien' },
  { id: 'brainstorm', name: 'Brainstorm', color: '#EF5350', glowColor: 'rgba(239,83,80,0.6)', emoji: '🦀', description: 'The intellectual Cerebrocrustacean' },
  { id: 'alien_x', name: 'Alien X', color: '#1A237E', glowColor: 'rgba(26,35,126,0.6)', emoji: '✨', description: 'The cosmic omnipotent Celestialsapien' },
];

export const getAlienAvatarInfo = (id: AlienAvatar): AlienAvatarInfo => {
  return ALIEN_AVATARS.find((a) => a.id === id) || ALIEN_AVATARS[0];
};

export const getAlienInitials = (name: string): string => {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};
