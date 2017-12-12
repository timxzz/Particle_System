/**
 * Created by Tim Xiao on 01/12/2017.
 */


var distanceBetweenMeshes = function ( m1, m2 ) {
    var x1 = m1.position.x;
    var x2 = m2.position.x;
    var y1 = m1.position.y;
    var y2 = m2.position.y;
    var z1 = m1.position.z;
    var z2 = m2.position.z;

    var dx = x1 - x2;
    var dy = y1 - y2;
    var dz = z1 - z2;

    var d = Math.sqrt( dx * dx + dy * dy + dz * dz );

    return d;
};

var randomPointOnCube = function () {
    var a = Math.random() * 2 - 1;
    var b = Math.random() * 2 - 1;
    var c = ( Math.random() > 0.5 ? 1 : -1 );

    var i = Math.floor(Math.random() * 3);

    if(i == 0){
        return [ c, a, b ];
    } else if(i == 1){
        return [ a, c, b ];
    } else {
        return [ a, b, c ];
    }
};

var cosA = function( a, b, c ){
    return (b * b + c * c - a * a) / (2.0 * b * c);
};

var getProjectionPoint = function ( planet, asteroid ) {
    var R = planet.r;
    var r = asteroid.r;
    var d = distanceBetweenMeshes( planet, asteroid );

    var cos = cosA( R, r, d );
    // simulate parallel
    if( cos <= 0 ){
        cos = 0.001;
    }
    var d_proPointToPlanet = d - r / cos;

    var vec_p = new THREE.Vector3().copy( asteroid.position );
    vec_p.multiplyScalar( d_proPointToPlanet );
    vec_p.normalize();
    vec_p.setLength( Math.abs( d_proPointToPlanet ) );


    var px = vec_p.x;
    var py = vec_p.y;
    var pz = vec_p.z;
    var sin_ = cos; // sin of the other angle
    var sin = Math.sqrt( 1 - cos * cos );
    var tan = sin / cos;

    return [ px, py, pz, sin_, tan ];
};

var getGravityAccele = function ( gm, r ) {
    return gm / ( r * r );
};

var getUrlVariable = function ( variableName, url_substring ) {
    var list = url_substring.substring(1);
    var vars = list.split( '&' );
    for ( var i = 0; i < vars.length; i++ ){
        var pair = vars[i].split( "=" );
        if( pair[0] == variableName ){ return pair[1]; }
    }
    return( false );
};

var updateLine = function ( particle, LINE_LENGTH, particle_world ) {

    var positions = particle.lineMesh.geometry.attributes.position.array; // might need to use getAttributes for access
    var thisPointIndex = particle.lineMesh.nextPointIndex;

    var x = particle_world.x;
    var y = particle_world.y;
    var z = particle_world.z;

    positions[ thisPointIndex * 3 ] = x;
    positions[ thisPointIndex * 3 + 1] = y;
    positions[ thisPointIndex * 3 + 2] = z;

    // when reach second half + 1, update the corresponding points in the first half
    if ( ( thisPointIndex > LINE_LENGTH ) && thisPointIndex < ( LINE_LENGTH * 2 ) ){

        var pointIndex_firstHalf = thisPointIndex - LINE_LENGTH - 1;
        positions[ pointIndex_firstHalf * 3 ] = x;
        positions[ pointIndex_firstHalf * 3 + 1 ] = y;
        positions[ pointIndex_firstHalf * 3 + 2 ] = z;
    }

    // update next drawing point index
    if ( thisPointIndex == ( LINE_LENGTH * 2 - 1 ) ){
        particle.lineMesh.nextPointIndex = LINE_LENGTH - 1;
    } else {
        particle.lineMesh.nextPointIndex++;
    }

    // update drawing range
    if ( thisPointIndex < LINE_LENGTH ){
        particle.lineMesh.geometry.setDrawRange( 0, thisPointIndex + 1 );
    } else {
        particle.lineMesh.geometry.setDrawRange( thisPointIndex + 1 - LINE_LENGTH, LINE_LENGTH );
    }

    particle.lineMesh.geometry.attributes.position.needsUpdate = true;
};






// Round to decimal from Mozilla
(function(){

    /**
     * Decimal adjustment of a number.
     *
     * @param   {String}    type    The type of adjustment.
     * @param   {Number}    value   The number.
     * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number}            The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }
})();
