/**
 * Created by tim on 05/12/2017.
 */

// initialise asteroid
var initialiseAsteroid = function ( aMesh, planetCore, asteroidRadius, scene ) {
    aMesh.position.x = 100;
    aMesh.position.y = 100;
    aMesh.position.z = 100;

    var velocity = 0.000001;
    var acce = 0.008; // random initial acce

    // initial flying velocity and acceleration
    aMesh.v = planetCore.clone().sub( aMesh.position ).setLength( velocity );
    aMesh.a = planetCore.clone().sub( aMesh.position ).setLength( acce );
    aMesh.r = asteroidRadius;

    scene.add( aMesh );
};

// restart the simulation
var restart = function ( aMesh, planetCore, asteroidRadius, scene, allParticleMesh, pColor_init, world, possibleTrails ) {
    initialiseAsteroid( aMesh, planetCore, asteroidRadius, scene );

    for ( var p_id = 0; p_id < allParticleMesh.length; p_id++ ){
        var pMesh = allParticleMesh[ p_id ];

        var particleCount = pMesh.geometry.vertices.length;

        for (var i = 0; i < particleCount; i++) {

            var particle_ = pMesh.geometry.vertices[i];

            particle_.v.copy( particle_.v_init );
            particle_.copy( particle_.xyz_init );

            pMesh.geometry.colors[i].setHex( pColor_init );

            // Initialise trails
            if ( possibleTrails ){
                particle_.lineMesh.nextPointIndex = 0;
                particle_.lineMesh.geometry.setDrawRange( 0, 0 );
            }

        }
        pMesh.nextTimeUpdate = true;
        pMesh.geometry.colorsNeedUpdate = true;
        pMesh.geometry.verticesNeedUpdate = true;
        pMesh.visible = false;
        pMesh.ttl = -1;
        scene.add( pMesh );

    }

    world.particlesProjected = false;
};