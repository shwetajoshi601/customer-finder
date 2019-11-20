import { ICoordinate } from "./HelperTypes";

/**
 * Interface defining the configuration parameters
 */
export interface IConfig {
    customerDataSrc: string;
    mainCoordinates: ICoordinate;
    distanceThreshold: number;
}
