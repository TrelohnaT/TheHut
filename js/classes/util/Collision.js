

export default class Collision {

    /**
     * 
     * @param {String} id 
     * @param {String} squareId 
     * @param {Set<String>} entitiesId 
     * @param {String} pointId
     */
    constructor(id, squareId, entitiesId, pointId)
    {
        this.id = id;
        this.squareId = squareId;
        this.entitiesId = entitiesId;
        this.pointId = pointId;
        
    }

}

