import { Phase } from './phase';
import { Task } from './task';

// Estende la Fase base e si assicura che includa i campi che il backend si aspetta per evitare 500

export interface PhaseRequest extends Phase {
    // Ereditiamo id, title, order, ecc. dalla Phase.
    // Il backend Java, quando riceve il JSON, si aspetta questi campi per la deserializzazione.
    // Aggiungiamo un campo tasks, anche se vuoto, per evitare NullPointerException nel backend Java.
    // L'oggetto Phase.java probabilmente richiede la lista tasks.
    tasks?: Task[]; 
}