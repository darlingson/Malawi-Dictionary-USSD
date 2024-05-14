export interface Interaction {
    interaction_level: string;
    start_time: string;
}

export interface InteractionMap {
    [interaction_id: string]: Interaction;
}
