// required for all type (anyone)
db.collection.createIndex({ locations: "2dsphere" })   // mostly used
db.collection.createIndex({ locations: "2d" })
//===============================================
//GeoJSON Supported Types in MongoDB

Point	                         //A single location ([longitude, latitude]) mostly used
LineString          	         //A line connecting multiple points
Polygon	                         //A shape consisting of a closed loop of points
MultiPoint	                     //Multiple points
MultiLineString	                 //Multiple LineStrings
MultiPolygon	                 //Multiple Polygons
GeometryCollection	             //A collection of geometry types
Feature and FeatureCollection	 //Not directly used in queries but can be stored


// Point Type ( most commonaly used)
{
    "type": "Point",
        "coordinates": [-73.856077, 40.848447]      //must be [Longitude, lattitude] in order
}

// LineString Type
{
    "type": "LineString",
        "coordinates": [[-73.856077, 40.848447], [-73.856077, 40.848447]]
}
// Polygon Type
{
    "type": "Polygon",
    "coordinates": [ [ [ 0 , 0 ] , [ 3 , 6 ] , [ 6 , 1 ] , [ 0 , 0  ] ] ]
 }
// Polygon  with multiple ring
{
    "type": "Polygon",
    "coordinates": [
        [ [ 0 , 0 ] , [ 3 , 6 ] , [ 6 , 1 ] , [ 0 , 0 ] ],  // outer ring
        [ [ 2 , 2 ] , [ 3 , 3 ] , [ 4 , 2 ] , [ 2 , 2 ] ]   // inner ring
     ]
 }
// MultiPoint Type
{
    "type": "MultiPoint",
        "coordinates": [
            [longitude1, latitude1],
            [longitude2, latitude2],
            ...
    ]
}
//MultiLineString  represents multiple lines, where each line is a series of connected points. 
{
    "type": "MultiLineString",
        "coordinates": [
            [[lng1, lat1], [lng2, lat2], ... ],   // Line 1
            [[lng3, lat3], [lng4, lat4], ... ]    // Line 2
        ]
}
//MultiPolygon
{
    "type": "MultiPolygon",     // independent polygon
        "coordinates": [
            [
                [[lng, lat], [lng, lat], ..., [lng, lat]] // first polygon
                // Optional: inner rings (holes)
            ],
            [
                [[lng, lat], [lng, lat], ..., [lng, lat]] // Another polygon
            ]
        ]
}
//GeometryCollection
{
    "type": "GeometryCollection",
        "geometries": [
            { "type": "Point", "coordinates": [lng, lat] },
            { "type": "LineString", "coordinates": [[lng1, lat1], [lng2, lat2]] },
            { "type": "Polygon", "coordinates": [[[lng3, lat3], ..., [lng3, lat3]]] }
        ]
}


//===================================
//$near – Sort by proximity
db.places.find({
    location: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [-73.99279, 40.719296]
            },
            $maxDistance: 1000 // meters
        }
    }
})
//$geoWithin – Match documents within a geometry 
db.places.find({
    location: {
        $geoWithin: {
            $geometry: {
                type: "Polygon",
                coordinates: [[
                    [-73.99756, 40.73083],
                    [-73.99756, 40.741404],
                    [-73.981149, 40.741404],
                    [-73.981149, 40.73083],
                    [-73.99756, 40.73083]
                ]]
            }
        }
    }
})
//$geoIntersects – Match if any part of the geometry intersects in polygon type document
db.places.find({
    location: {
        $geoIntersects: {       //find intersection from cordinate provided in documentd
            $geometry: {
                type: "LineString",   // "point" "polygon" type also supported
                coordinates: [
                    [-73.998, 40.730],
                    [-73.991, 40.740]
                ]
            }
        }
    }
})
//Calculating Distance (without sorting)
db.places.aggregate([
    {
        $geoNear: {
            near: { type: "Point", coordinates: [-73.99279, 40.719296] },
            distanceField: "dist.calculated",
            spherical: true
        }
    }
])
//====================================
//Geospatial Query Operators
$geoIntersects    //Selects geometries that intersect with a GeoJSON geometry. The 2dsphere index supports $geoIntersects.
$geoWithin        //Selects geometries within a bounding GeoJSON geometry. The 2dsphere and 2d indexes support $geoWithin.
$near             //Returns geospatial objects in proximity to a point. Requires a geospatial index. The 2dsphere and 2d indexes support $near.
$geoNear (Aggregation)   //Geospatial query in aggregation pipeline — returns documents with distance field.
$nearSphere       //Returns geospatial objects in proximity to a point on a sphere. Requires a geospatial index. The 2dsphere and 2d indexes support $nearSphere.

