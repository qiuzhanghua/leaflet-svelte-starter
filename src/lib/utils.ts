import * as turf from '@turf/turf';
import type {FeatureCollection} from "@turf/turf";

export function randomData(count: number, num_vertices: number, bbox: number[]): FeatureCollection {
    return turf.randomLineString(count, {bbox, num_vertices});
}
