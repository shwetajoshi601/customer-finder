/**
 * Interface defining a set of Co-ordinates
 */
export interface ICoordinate {
    latitude: number;
    longitude: number;
}


/**
 * Interface defining co-ordinate validation result
 */
export interface IResult {
    isValid: boolean;
    coordinate: ICoordinate;
}