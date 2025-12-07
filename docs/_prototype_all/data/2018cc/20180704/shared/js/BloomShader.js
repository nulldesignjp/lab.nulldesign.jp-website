


    var SAMPLE_COUNT = 15;
    var offsetH = [];
    var weightH = [];
    {
        var offsetTmp = [];
        var total = 0;

        for (var i = 0; i < SAMPLE_COUNT; i++) {
            var p = (i - (SAMPLE_COUNT - 1) * 0.5) * 0.0018;
            offsetTmp[i] = p;
            weightH[i] = Math.exp(-p * p / 2) / Math.sqrt(Math.PI * 2);
            total += weightH[i];
        }
        for (var i = 0; i < SAMPLE_COUNT; i++) {
            weightH[i] /= total;
        }
        var tmp = [];
        for (var key in offsetTmp) {
            tmp.push(offsetTmp[key], 0);
        }
        offsetH = new Float32Array(tmp);
    }

    var offsetV = [];
    var weightV = [];
    {
        var offsetTmp = [];
        var total = 0;

        for (var i = 0; i < SAMPLE_COUNT; i++) {
            var p = (i - (SAMPLE_COUNT - 1) * 0.5) * 0.0018;
            offsetTmp[i] = p;
            weightV[i] = Math.exp(-p * p / 2) / Math.sqrt(Math.PI * 2);
            total += weightV[i];
        }
        for (var i = 0; i < SAMPLE_COUNT; i++) {
            weightV[i] /= total;
        }
        var tmp = [];
        for (var key in offsetTmp) {
            tmp.push(0, offsetTmp[key]);
        }
        offsetV = new Float32Array(tmp);
    }

THREE.BloomShader = {

	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 },
		"resolution":     { type: "f", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },

		"minBright":     { type: "f", value: 0.5 },
		"toneScale":     { type: "f", value: 1.0 },

		"offsetsH":   { value: offsetH },
		"weightsH":   { value: weightH },
		"offsetsV":   { value: offsetV },
		"weightsV":   { value: weightV },
	},

	vertexShader: [
		"void main() {",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [
		"#define R_LUMINANCE 0.298912",
		"#define G_LUMINANCE 0.586611",
		"#define B_LUMINANCE 0.114478",

		"const vec3 monochromeScale = vec3(R_LUMINANCE, G_LUMINANCE, B_LUMINANCE);",

		"#define SAMPLE_COUNT " + SAMPLE_COUNT,
		"uniform vec2 offsetsV[SAMPLE_COUNT];",
		"uniform float weightsV[SAMPLE_COUNT];",
		"uniform vec2 offsetsH[SAMPLE_COUNT];",
		"uniform float weightsH[SAMPLE_COUNT];",

		"uniform sampler2D tDiffuse;",
		"uniform float time;",
		"uniform vec2 resolution;",

		"uniform float minBright;",
		"uniform float toneScale;",

		"void main() {",
		"	vec2 uv = gl_FragCoord.xy / resolution.xy;",
		"	vec4 bloomColor = vec4(0.0);",
		"	gl_FragColor = texture2D( tDiffuse, uv );",

		"	vec3 texel = max(vec3(0.0), (texture2D(tDiffuse, uv) - minBright ).rgb);",
		"	bloomColor.rgb = texel * toneScale;",
		
        "	for (int i = 0; i < SAMPLE_COUNT; i++) {",
        //"	    bloomColor += texture2D( tDiffuse, uv + offsetsH[i]) * weightsH[i];",			
        "	    bloomColor.rgb += max(vec3(0.0), ( texture2D( tDiffuse, uv + offsetsH[i]) * weightsH[i] - minBright ).rgb );",
        "	}",
        "",
        "	for (int i = 0; i < SAMPLE_COUNT; i++) {",
        //"	    bloomColor += texture2D( tDiffuse, uv + offsetsV[i]) * weightsV[i];",
        "	    bloomColor.rgb += max(vec3(0.0), ( texture2D( tDiffuse, uv + offsetsV[i]) * weightsV[i] - minBright ).rgb );",
        "	}",
		
        "	bloomColor.a = 1.0;",
		"	gl_FragColor += bloomColor;",
		"}"

	].join("\n")

};
