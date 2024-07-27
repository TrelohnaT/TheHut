

export default class Collision {

    /**
     * 
     * @param {String} id 
     * @param {String} squareId 
     * @param {Set<String>} entitiesId 
     */
    constructor(id, squareId, entitiesId)
    {
        this.id = id;
        this.squareId = squareId;
        this.entitiesId = entitiesId;
        
    }

}

