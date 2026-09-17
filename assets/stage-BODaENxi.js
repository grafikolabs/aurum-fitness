import{f as e,h as t,m as n,p as r}from"./preload-helper-CUKM1J6s.js";import{BoxGeometry as i,BufferAttribute as a,BufferGeometry as o,CanvasTexture as s,CircleGeometry as c,Color as l,ColorManagement as u,CylinderGeometry as d,DirectionalLight as f,ExtrudeGeometry as p,Float32BufferAttribute as m,FogExp2 as h,Group as g,HalfFloatType as _,HemisphereLight as v,InstancedMesh as y,LatheGeometry as ee,MathUtils as b,Matrix4 as te,Mesh as x,MeshBasicMaterial as S,MeshPhysicalMaterial as C,MeshStandardMaterial as w,OctahedronGeometry as T,OrthographicCamera as ne,PMREMGenerator as re,PerspectiveCamera as E,PlaneGeometry as D,PointLight as O,Points as ie,RawShaderMaterial as ae,RingGeometry as oe,SRGBColorSpace as k,Scene as A,ShaderMaterial as j,Shape as se,SphereGeometry as M,Sprite as ce,SpriteMaterial as le,Timer as ue,TorusGeometry as N,UniformsUtils as P,Vector2 as F,Vector3 as I,WebGLRenderTarget as L,WebGLRenderer as de}from"./three.module-4gI5Z-_B.js";var R={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},z=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},B=new ne(-1,1,1,-1,0,1),V=new class extends o{constructor(){super(),this.setAttribute(`position`,new m([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new m([0,2,0,0,2,0],2))}},H=class{constructor(e){this._mesh=new x(V,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,B)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},fe=class extends z{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof j?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=P.clone(e.uniforms),this.material=new j({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new H(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},U=class extends z{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},pe=class extends z{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},me=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new F);this._width=n.width,this._height=n.height,t=new L(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:_}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new fe(R),this.copyPass.material.blending=0,this.timer=new ue}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}U!==void 0&&(r instanceof U?n=!0:r instanceof pe&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new F);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},he=class extends z{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new l}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},ge={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new l(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},W=class e extends z{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new F(256,256):new F(e.x,e.y),this.clearColor=new l(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new L(i,a,{type:_,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new L(i,a,{type:_,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new L(i,a,{type:_,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=ge;this.highPassUniforms=P.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new j({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new F(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=P.clone(R.uniforms),this.blendMaterial=new j({uniforms:this.copyUniforms,vertexShader:R.vertexShader,fragmentShader:R.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new l,this._oldClearAlpha=1,this._basic=new S,this._fsQuad=new H(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new F(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new j({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new F(.5,.5)},direction:{value:new F(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new j({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};W.BlurDirectionX=new F(1,0),W.BlurDirectionY=new F(0,1);var G={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},_e=class extends z{constructor(){super(),this.isOutputPass=!0,this.uniforms=P.clone(G.uniforms),this.material=new ae({name:G.name,uniforms:this.uniforms,vertexShader:G.vertexShader,fragmentShader:G.fragmentShader}),this._fsQuad=new H(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},u.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};new l(`#130000`),new l(`#e02b20`),new l(`#e0b65c`),new l(`#c9992e`),new l(`#f2d492`),new l(`#f5ecdd`);function ve({quality:e}){return{gold:new C({color:`#e8bd62`,metalness:1,roughness:.24,clearcoat:.4,clearcoatRoughness:.2}),brass:new w({color:`#7d6440`,metalness:1,roughness:.42}),velvet:new C({color:`#b3170f`,roughness:.62,metalness:0,sheen:1,sheenColor:new l(`#ff5a40`),sheenRoughness:.35}),cream:new C({color:`#efe0c8`,roughness:.32,metalness:0,clearcoat:.8,clearcoatRoughness:.18}),iron:new w({color:`#1d0c09`,metalness:.88,roughness:.36}),stone:new w({color:`#2b1511`,metalness:.15,roughness:.62}),glass:e===`high`?new C({color:`#fff4e6`,metalness:0,roughness:.06,transmission:1,thickness:.35,ior:1.5,iridescence:.35,iridescenceIOR:1.3,clearcoat:1,clearcoatRoughness:.05,attenuationColor:new l(`#f2d492`),attenuationDistance:2.5,specularIntensity:1}):new C({color:`#f5ecdd`,metalness:0,roughness:.08,transparent:!0,opacity:.16,clearcoat:1,clearcoatRoughness:.05,depthWrite:!1})}}function ye(e){let t=new A,n=new x(new M(20,32,16),new S({color:`#0d0302`,side:1}));t.add(n);let r=(e,n,r,i,a,o)=>{let s=new x(new D(r,i),new S({color:new l(e).multiplyScalar(n),side:2}));s.position.set(...a),s.lookAt(...o),t.add(s)};r(`#fff1d6`,5,14,5,[0,12,4],[0,0,0]),r(`#f0dcc0`,5,1.2,14,[-11,3,3],[0,2,0]),r(`#f0dcc0`,3.5,1.2,14,[11,3,-2],[0,2,0]),r(`#e02b20`,6,10,1.4,[0,1,-12],[0,1,0]),r(`#ffe2b0`,3,6,3,[4,4,12],[0,1,0]),r(`#3a2405`,2,30,30,[0,-8,0],[0,0,0]);let i=new re(e),a=i.fromScene(t,.035);return i.dispose(),t.traverse(e=>{e.geometry?.dispose(),e.material?.dispose()}),a.texture}var K={crown:[[-.32911,.5],[-.24557,.5],[-.21013,.49494],[-.05823,.49747],[-.0557,.48228],[-.06076,.44177],[-.06835,.41646],[-.09367,.36835],[-.13671,.32278],[-.17975,.29494],[-.17975,.09494],[-.17215,.07468],[-.16203,.06203],[-.14177,.04937],[-.12152,.04684],[.06076,.04937],[.12911,.0443],[.15949,.05443],[.17468,.06962],[.18228,.08481],[.18481,.29241],[.13418,.32785],[.08608,.38608],[.07595,.4038],[.06329,.4443],[.06076,.49747],[.33671,.49747],[.34177,.4038],[.34177,.02152],[.34684,.01646],[.38481,.01139],[.42532,-.0038],[.49367,-.01899],[.63544,-.07215],[.76203,-.13291],[.83291,-.17342],[.84557,-.18861],[.84557,-.19873],[.83038,-.20127],[.76962,-.1962],[.61519,-.16329],[.38734,-.12785],[.19494,-.11013],[.04304,-.10506],[-.14177,-.10759],[-.33418,-.12278],[-.56962,-.1557],[-.77215,-.1962],[-.82785,-.20127],[-.84304,-.19873],[-.84304,-.18354],[-.81266,-.16076],[-.66835,-.08481],[-.51646,-.02658],[-.47342,-.01646],[-.42532,.00127],[-.3519,.01646],[-.33671,.02405],[-.33671,.49494]],ring:[[-.20506,-.13797],[-.18228,-.13797],[-.17722,-.20633],[-.16456,-.2443],[-.14937,-.26709],[-.11139,-.30759],[-.07848,-.32785],[-.04304,-.34051],[-.00253,-.34557],[.04557,-.34304],[.08861,-.32785],[.11899,-.31013],[.15696,-.26962],[.17468,-.23671],[.18481,-.20633],[.19494,-.13797],[.3443,-.15823],[.34684,-.17848],[.33924,-.23924],[.31899,-.29747],[.28354,-.36076],[.23544,-.41392],[.19494,-.4443],[.13418,-.47722],[.06329,-.49747],[-.03291,-.5],[-.07595,-.49241],[-.11646,-.47975],[-.16456,-.45696],[-.21519,-.42152],[-.27342,-.35823],[-.31392,-.28228],[-.33165,-.22405],[-.33924,-.15823],[-.33418,-.15316]]};function be(e,{height:t=2.6}={}){let n=new g;n.name=`emblem`;let r=e=>new se(e.map(([e,t])=>new F(e,t))),i=(e,t)=>{let n=new p(r(e),{depth:t,bevelEnabled:!0,bevelThickness:.018,bevelSize:.011,bevelSegments:4,curveSegments:1});return n.translate(0,0,-t/2),n.computeVertexNormals(),n},a=new x(i(K.crown,.075),[e.velvet,e.gold]),o=new x(i(K.ring,.06),[e.cream,e.gold]);o.position.z=-.012;let s=new g;s.add(a,o),s.scale.setScalar(t),n.add(s);let c=new x(new D(1,1),new j({transparent:!0,depthWrite:!1,blending:2,uniforms:{uColor:{value:new l(`#e0b65c`)},uStrength:{value:.26}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,fragmentShader:`uniform vec3 uColor; uniform float uStrength; varying vec2 vUv;
        void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(max(0.0, 1.0 - d), 2.6) * uStrength; gl_FragColor = vec4(uColor * a, a); }`}));return c.scale.setScalar(t*2.6),c.position.z=-.9,c.renderOrder=-1,n.add(c),n.userData.halo=c,n}var xe=[[.085,-.055],[.085,.055],[.16,.055],[.185,.04],[.23,.028],[.84,.028],[.875,.07],[.965,.075],[1,.045],[1,-.045],[.965,-.075],[.875,-.07],[.84,-.028],[.23,-.028],[.185,-.04],[.16,-.055],[.085,-.055]],q;function Se(){return q||(q=new ee(xe.map(([e,t])=>new F(e,t)),96),q.computeVertexNormals()),q}function Ce(e,{size:t=1024,outer:n=.82,inner:r=.34}={}){let i=document.createElement(`canvas`);i.width=i.height=t;let a=i.getContext(`2d`),o=t/2;a.translate(o,o);let c=a.createLinearGradient(-o,-o,o,o);c.addColorStop(0,`#7d6a4f`),c.addColorStop(.45,`#cbbb9c`),c.addColorStop(1,`#8f7a58`),a.fillStyle=c,a.strokeStyle=c;let l=e=>e/n*o;a.lineWidth=3,[.78,.5].forEach(e=>{a.beginPath(),a.arc(0,0,l(e),0,Math.PI*2),a.stroke()});for(let e=0;e<120;e++){let t=e/120*Math.PI*2,n=e%10==0?26:12;a.save(),a.rotate(t),a.fillRect(l(.5)+4,-1.2,n,2.4),a.restore()}a.font=`700 ${Math.round(t*.05)}px Antonio, "Arial Narrow", sans-serif`,a.textBaseline=`middle`,a.textAlign=`center`;let u=l(.66),d=[...e],f=d.map(e=>a.measureText(e).width+t*.012),p=f.reduce((e,t)=>e+t,0),m=-Math.PI/2-p/u/2;d.forEach((e,t)=>{let n=f[t];m+=n/2/u,a.save(),a.rotate(m),a.translate(0,-u),a.fillText(e,0,0),a.restore(),m+=n/2/u});let h=new s(i);return h.colorSpace=k,h.anisotropy=8,{tex:h,outer:n,inner:r}}function J(e,{radius:t=3.4,text:n=`AURUM FITNESS  ✦  BANGALORE  ✦  `,accent:r=!1}={}){let i=new g,a=new x(Se(),e.iron);i.add(a);let o=new x(new N(.92,.012,12,160),e.brass);o.rotation.x=Math.PI/2;let s=o.clone();o.position.y=.076,s.position.y=-.076;let c=new x(new N(.17,.02,12,64),e.brass);c.rotation.x=Math.PI/2,c.position.y=.056,i.add(o,s,c);let{tex:u,outer:d,inner:f}=Ce(n),p=new w({map:u,transparent:!0,metalness:.9,roughness:.3,emissive:new l(`#d8c7a4`),emissiveMap:u,emissiveIntensity:r?.1:.04,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),m=new oe(f,d,128,1),h=new x(m,p);h.rotation.x=-Math.PI/2,h.position.y=.0295;let _=new x(m,p);return _.rotation.x=Math.PI/2,_.rotation.z=Math.PI,_.position.y=-.0295,i.add(h,_),i.scale.set(t,t,t),i.userData={decalMat:p},i}function we(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},s={},c=e[0].morphTargetsRelative,l=new o,u=0;for(let o=0;o<e.length;++o){let d=e[o],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+o+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+o+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+o+`. Make sure all geometries have the same number of attributes.`),null;if(c!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+o+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+o+`.  .morphAttributes must be consistent throughout all geometries.`),null;s[e]===void 0&&(s[e]=[]),s[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+o+`. The geometry must have either an index or a position attribute`),null;l.addGroup(u,e,o),u+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}l.setIndex(n)}for(let e in a){let t=Y(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;l.setAttribute(e,t)}for(let e in s){let t=s[e][0].length;if(t!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<s[e].length;++r)t.push(s[e][r][n]);let r=Y(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;l.morphAttributes[e].push(r)}}}return l}function Y(e){let t,n,r,i=-1,o=0;for(let a=0;a<e.length;++a){let s=e[a];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;o+=s.count*n}let s=new t(o),c=new a(s,n,r),l=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=l/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);c.setComponent(t+e,i,n)}}else s.set(r.array,l);l+=r.count*n}return i!==void 0&&(c.gpuType=i),c}function Te(e){let t=new d(.5,.58,e,96,24,!0),n=t.attributes.position,r=new I;for(let e=0;e<n.count;e++){r.fromBufferAttribute(n,e);let t=Math.atan2(r.z,r.x),i=1-.045*(.5+.5*Math.cos(t*20))**2;n.setXYZ(e,r.x*i,r.y,r.z*i)}t.computeVertexNormals(),t.translate(0,e/2+.7,0);let a=[t,new i(1.7,.4,1.7).translate(0,.2,0),new d(.72,.78,.3,48).translate(0,.55,0),new d(.78,.52,.45,48).translate(0,e+.9,0),new i(1.8,.35,1.8).translate(0,e+1.3,0)].map(e=>e.index?e.toNonIndexed():e);return a.forEach(e=>{e.deleteAttribute(`uv`)}),we(a)}function Ee(e,{count:t=16,height:n=12}={}){let i=new g,a=Te(n),o=new y(a,e.stone,t),s=new te;for(let e=0;e<t;e++){let n=e/t*Math.PI*2+Math.PI/t;s.makeRotationY(-n),s.setPosition(Math.sin(n)*24,r,Math.cos(n)*24),o.setMatrixAt(e,s)}i.add(o);let c=new x(new d(25.1,25.1,1.2,128,1,!0),new w({color:`#241210`,roughness:.6,metalness:.2,side:2}));c.position.y=r+n+2.1;let l=new x(new N(25.05,.03,8,256),e.brass);return l.rotation.x=Math.PI/2,l.position.y=r+n+1.6,i.add(c,l),i}function De({beacons:e=[]}={}){let t={uTime:{value:0},uMap:{value:0},uWarm:{value:1},uBeacons:{value:Array.from({length:6},(t,n)=>new I(e[n]?.x??999,e[n]?.z??999,0))},uFogColor:{value:new l(`#0c0201`)}},n=new j({uniforms:t,transparent:!1,vertexShader:`varying vec3 vWorld; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      uniform float uTime, uMap, uWarm; uniform vec3 uBeacons[6]; uniform vec3 uFogColor;
      varying vec3 vWorld;
      // Edges kept ascending: reversed smoothstep is undefined in GLSL and can return NaN.
      float ring(float d, float r, float w){ return 1.0 - smoothstep(0.0, w, abs(d - r)); }
      float grid(vec2 p, float s, float w){ vec2 g = abs(fract(p / s - 0.5) - 0.5) * s; return 1.0 - smoothstep(0.0, w, min(g.x, g.y)); }
      void main(){
        vec2 p = vWorld.xz; float d = length(p);
        vec3 base = mix(vec3(0.075, 0.018, 0.012), vec3(0.03, 0.006, 0.004), smoothstep(2.0, 22.0, d));
        // warm pool of light under the emblem
        base += vec3(0.55, 0.24, 0.1) * 0.16 * uWarm * exp(-d * d / 26.0);
        vec3 gold = vec3(0.72, 0.65, 0.54);
        float inlay = ring(d, 4.2, 0.03) + ring(d, 9.5, 0.025) + ring(d, 23.2, 0.05) * 0.8 + ring(d, 25.0, 0.02);
        // radial spokes between the columns
        float ang = atan(p.y, p.x + 1e-4); float spokes = (1.0 - smoothstep(0.0, 0.012, abs(sin(ang * 8.0)) * d * 0.12)) * smoothstep(4.2, 9.5, d) * (1.0 - smoothstep(9.5, 23.2, d));
        vec3 col = base + gold * (inlay * 0.26 + spokes * 0.08) * (1.0 - uMap * 0.5);
        // city map layer
        float fine = grid(p, 1.0, 0.02) * 0.06; float major = grid(p, 5.0, 0.035) * 0.2;
        float compass = ring(d, 6.0, 0.02) * 0.25 + ring(d, 12.0, 0.02) * 0.18;
        vec3 mapCol = gold * (fine + major + compass) * (1.0 - smoothstep(6.0, 19.0, d));
        float pulse = 0.0;
        for (int i = 0; i < 6; i++) {
          float bd = length(p - uBeacons[i].xy);
          float lit = uBeacons[i].z;
          pulse += exp(-bd * bd * (2.4 - lit * 1.2)) * (0.18 + lit * 0.6);
          pulse += ring(bd, mod(uTime * 1.2 + float(i) * 0.37, 3.0), 0.05) * (1.0 - mod(uTime * 1.2 + float(i) * 0.37, 3.0) / 3.0) * (0.3 + lit);
        }
        mapCol += vec3(0.88, 0.17, 0.12) * pulse * 0.5;
        col += mapCol * uMap;
        float fog = smoothstep(20.0, 44.0, d);
        gl_FragColor = vec4(mix(col, uFogColor, fog), 1.0);
        #include <colorspace_fragment>
      }`}),i=new x(new c(52,160),n);return i.rotation.x=-Math.PI/2,i.position.y=r,i.userData.uniforms=t,i}function Oe({count:e=1800,radius:t=22,height:n=16}={}){let r=new Float32Array(e*3),i=new Float32Array(e);for(let a=0;a<e;a++){let e=Math.sqrt(Math.random())*t,o=Math.random()*Math.PI*2;r[a*3]=Math.cos(o)*e,r[a*3+1]=Math.random()*n,r[a*3+2]=Math.sin(o)*e,i[a]=Math.random()}let s=new o;s.setAttribute(`position`,new a(r,3)),s.setAttribute(`aSeed`,new a(i,1));let c={uTime:{value:0},uSteam:{value:0},uOpacity:{value:1},uPixelRatio:{value:1},uHeight:{value:n}},l=new j({uniforms:c,transparent:!0,depthWrite:!1,blending:2,vertexShader:`
      uniform float uTime, uSteam, uPixelRatio, uHeight; attribute float aSeed; varying float vAlpha; varying float vSeed;
      void main(){
        vec3 p = position;
        float speed = mix(0.12, 0.9, uSteam) * (0.4 + aSeed);
        p.y = mod(p.y + uTime * speed, uHeight) - 3.0;
        p.x += sin(uTime * 0.3 + aSeed * 40.0) * (0.4 + uSteam * 0.8);
        p.z += cos(uTime * 0.25 + aSeed * 30.0) * 0.4;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = mix(1.4, 3.0, aSeed) * (1.0 + uSteam * 1.8);
        gl_PointSize = size * uPixelRatio * (14.0 / -mv.z);
        float edge = smoothstep(0.0, 2.0, p.y + 3.0) * (1.0 - smoothstep(uHeight - 6.0, uHeight - 3.0, p.y));
        vAlpha = edge * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 60.0)));
        vSeed = aSeed;
      }`,fragmentShader:`
      uniform float uOpacity, uSteam; varying float vAlpha; varying float vSeed;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = 1.0 - smoothstep(0.0, 0.5, d);
        vec3 gold = mix(vec3(1.0, 0.9, 0.78), vec3(0.98, 0.95, 0.9), vSeed);
        vec3 col = mix(gold, vec3(0.96, 0.9, 0.82), uSteam * 0.6);
        gl_FragColor = vec4(col, a * vAlpha * uOpacity * mix(0.55, 0.3, uSteam));
      }`}),u=new ie(s,l);return u.frustumCulled=!1,u.userData.uniforms=c,u}var X=new I;function Z(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;X.copy(t),X[r]=0,X.normalize();let l=.5*o/(o+s),u=1-X.angleTo(e)/c;return Math.sign(X[n])===1?u*l:s/(o+s)+l+l*(1-u)}var Q=class e extends i{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let s=new I,c=new I,l=new I(e,t,n).divideScalar(2).subScalar(i),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,m=new I,h=.5/a;for(let r=0,a=0;r<u.length;r+=3,a+=2)switch(s.fromArray(u,r),c.copy(s),c.x-=Math.sign(c.x)*h,c.y-=Math.sign(c.y)*h,c.z-=Math.sign(c.z)*h,c.normalize(),u[r+0]=l.x*Math.sign(s.x)+c.x*i,u[r+1]=l.y*Math.sign(s.y)+c.y*i,u[r+2]=l.z*Math.sign(s.z)+c.z*i,d[r+0]=c.x,d[r+1]=c.y,d[r+2]=c.z,Math.floor(r/p)){case 0:m.set(1,0,0),f[a+0]=Z(m,c,`z`,`y`,i,n),f[a+1]=1-Z(m,c,`y`,`z`,i,t);break;case 1:m.set(-1,0,0),f[a+0]=1-Z(m,c,`z`,`y`,i,n),f[a+1]=1-Z(m,c,`y`,`z`,i,t);break;case 2:m.set(0,1,0),f[a+0]=1-Z(m,c,`x`,`z`,i,e),f[a+1]=Z(m,c,`z`,`x`,i,n);break;case 3:m.set(0,-1,0),f[a+0]=1-Z(m,c,`x`,`z`,i,e),f[a+1]=1-Z(m,c,`z`,`x`,i,n);break;case 4:m.set(0,0,1),f[a+0]=1-Z(m,c,`x`,`y`,i,e),f[a+1]=1-Z(m,c,`y`,`x`,i,t);break;case 5:m.set(0,0,-1),f[a+0]=Z(m,c,`x`,`y`,i,e),f[a+1]=1-Z(m,c,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}};function ke(e,t){let n=()=>{let n=e.image;if(!n?.width)return;let r=n.width/n.height;e.repeat.set(r>t?t/r:1,r>t?1:r/t),e.offset.set((1-e.repeat.x)/2,(1-e.repeat.y)/2)};e.image?.width?n():e.onUpdate=()=>{e.onUpdate=null,n()}}function Ae(e,t,{radius:n=6,width:r=3.7}={}){let i=new g,a=r*.62,o=Math.PI*2/t.length,s=new Q(r,a,.14,5,.1),c=new Q(r+.08,a+.08,.04,4,.12),u=new D(r-.22,a-.22);return i.userData={cards:t.map((t,d)=>{let f=new g,p=new S({map:t,toneMapped:!1,color:new l(.9,.9,.9)});ke(t,(r-.22)/(a-.22));let m=new x(u,p);m.position.z=-.03;let h=new x(u,p);h.rotation.y=Math.PI,h.position.z=-.12;let _=new x(s,e.glass),v=new x(c,e.iron);v.position.z=-.075,f.add(v,m,h,_);let y=d*o;return f.position.set(Math.sin(y)*n,0,Math.cos(y)*n),f.rotation.y=y,f.userData={photoMat:p,base:y},i.add(f),f}),step:o,radius:n},i}function je(e,{index:t,time:n,visibility:r,cameraTheta:i}){let{cards:a,step:o}=e.userData;e.rotation.y=i-t*o,a.forEach((e,i)=>{let o=a.length,s=((i-t)%o+o)%o;s>o/2&&(s-=o);let c=b.clamp(1-Math.abs(s),0,1);e.position.y=Math.sin(n*.7+i*1.3)*.12+(1-r)*-6,e.rotation.z=Math.sin(n*.4+i)*.02;let l=(.82+c*.18)*r;e.scale.setScalar(Math.max(l,1e-4)),e.userData.photoMat.color.setScalar(.32+c*.6)}),e.visible=r>.01}function Me(e,r){let i=new g,a=[...r].sort((e,t)=>t.level-e.level).map((r,a)=>{let o=J(e,{radius:3.1-a*.28,text:`LEVEL ${r.level}  ✦  ${r.name.toUpperCase()}  ✦  `});return o.position.y=n+a*t,o.userData.baseY=o.position.y,i.add(o),o}),o=new x(new d(.16,.16,t*5+1.2,32),e.iron);return o.position.y=n+t*2,i.add(o),i.userData={plates:a,bar:o},i}function Ne(e,{visibility:t,level:n,time:r}){let{plates:i,bar:a}=e.userData;e.visible=t>.01,e.visible&&(i.forEach((e,i)=>{let a=1-(1-b.clamp(t*1.6-i*.15,0,1))**3;e.position.y=e.userData.baseY-(1-a)*10;let o=Math.max(0,1-Math.abs(n-i));e.rotation.y=r*(.08+i*.015)*(i%2?-1:1),e.userData.decalMat.emissiveIntensity=.03+o*.4}),a.scale.y=Math.max(.001,t))}function Pe(e,{scale:t=3.1}={}){let n=e.reduce((e,t)=>e+t.lat,0)/e.length,r=e.reduce((e,t)=>e+t.lng,0)/e.length,i=111.32*Math.cos(n*Math.PI/180);return e.map(e=>({key:e.key,name:e.name,area:e.area,x:(e.lng-r)*i*t,z:-(e.lat-n)*110.57*t}))}function $(e,t){let n=document.createElement(`canvas`);n.width=768,n.height=192;let r=n.getContext(`2d`);r.textAlign=`center`,r.fillStyle=`#f5ecdd`,r.font=`700 64px Antonio, "Arial Narrow", sans-serif`,r.fillText(e.toUpperCase(),384,84),r.fillStyle=`rgba(245, 236, 221, 0.62)`,r.font=`600 30px "Montserrat Variable", Montserrat, sans-serif`,r.fillText(t.toUpperCase().split(``).join(` `),384,142);let i=new s(n);return i.colorSpace=k,i}function Fe(e,t){let n=new g,i=()=>new j({transparent:!0,depthWrite:!1,blending:2,side:2,uniforms:{uColor:{value:new l(`#d9cfc1`)},uIntensity:{value:.6},uTime:{value:0}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,fragmentShader:`uniform vec3 uColor; uniform float uIntensity, uTime; varying vec2 vUv;
      void main(){ float a = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 2.2) * uIntensity; a *= 0.85 + 0.15 * sin(uTime * 3.0 + vUv.y * 20.0); gl_FragColor = vec4(uColor * a, a); }`});return n.userData={beacons:t.map((t,a)=>{let o=new g;o.position.set(t.x,r,t.z);let s=new x(new d(.05,.42,9,32,1,!0),i());s.position.y=4.5;let c=new x(new T(.34,0),e.brass);c.position.y=1.3;let l=new ce(new le({map:$(t.name.replace(`Aurum `,``),t.area),transparent:!0,depthWrite:!1,toneMapped:!1}));return l.scale.set(4,1,1),l.position.y=2.4+a%2*1.5,l.center.set(.5,0),o.add(s,c,l),o.userData={beam:s,gem:c,label:l,key:t.key},n.add(o),o})},n}function Ie(e,t,{visibility:n,activeKey:r,time:i}){e.visible=n>.01,t.uMap.value=n;let{beacons:a}=e.userData;a.forEach((e,a)=>{let o=+(e.userData.key===r);e.userData.activeTarget=o,e.userData.active=b.lerp(e.userData.active??0,o,.08);let s=e.userData.active,c=b.clamp(n*1.4-a*.08,0,1);e.scale.set(1,Math.max(c,.001),1),e.userData.beam.material.uniforms.uTime.value=i,e.userData.beam.material.uniforms.uIntensity.value=(.2+s*.8)*c,e.userData.beam.material.uniforms.uColor.value.set(s>.5?`#e8392c`:`#d9cfc1`),e.userData.gem.rotation.y=i*(.6+s),e.userData.gem.position.y=1.3+Math.sin(i*1.4+a)*.12+s*.4,e.userData.label.material.opacity=c*(.55+s*.45),e.userData.label.scale.set(4*(1+s*.2),1*(1+s*.2),1),t.uBeacons.value[a].z=s})}var Le=class{constructor(t,{quality:n=`high`,lite:r=!1,pillarTextures:i=[],ptLevels:a=[],locations:o=[]}={}){this.canvas=t,this.quality=n,this.lite=r,this.reduced=matchMedia(`(prefers-reduced-motion: reduce)`).matches,this.state={...e},this.target={...e},this.pointer=new F,this.pointerDamped=new F,this.time=0,this.paused=!1;let s=new de({canvas:t,antialias:n===`high`,alpha:!1,powerPreference:`high-performance`});s.setClearColor(`#000000`,1),s.outputColorSpace=k,s.toneMapping=4,s.toneMappingExposure=1.05,this.renderer=s,this.dprCap=n===`high`?1.75:1.5;let c=new A;c.fog=new h(`#0c0201`,.028),c.add(new x(new M(100,32,16),new S({color:`#0c0201`,side:1,fog:!1,depthWrite:!1}))),c.environment=ye(s),c.environmentIntensity=.9,this.scene=c,this.camera=new E(35,1,.1,120);let l=ve({quality:n});this.materials=l,c.add(new v(`#6b4520`,`#130000`,.5));let u=new f(`#ffe0ad`,2.4);if(u.position.set(4,9,8),c.add(u),this.rimRed=new O(`#ff2b1c`,90,30,2),this.rimRed.position.set(-6,3.5,-4),this.rimGold=new O(`#ffd9b0`,45,30,2),this.rimGold.position.set(6.5,5,-3),this.fill=new O(`#ffd08a`,30,18,2),this.fill.position.set(0,1,6),c.add(this.rimRed,this.rimGold,this.fill),this.emblem=be(l),c.add(this.emblem),this.plate=J(l,{radius:2.85,accent:!0}),this.plateHolder=new g,this.plate.rotation.x=Math.PI/2,this.plate.position.z=-1.3,this.plateHolder.add(this.plate),c.add(this.plateHolder),this.colonnade=Ee(l,{count:n===`high`?22:16}),c.add(this.colonnade),this.points=Pe(o),this.floor=De({beacons:this.points}),c.add(this.floor),this.dust=Oe({count:n===`high`?1800:800}),c.add(this.dust),r||(this.carousel=Ae(l,i),this.carousel.position.y=.9,c.add(this.carousel),this.tower=Me(l,a),c.add(this.tower),this.map=Fe(l,this.points),c.add(this.map)),n===`high`){let e=new L(1,1,{type:_,samples:4});this.composer=new me(s,e),this.composer.addPass(new he(c,this.camera)),this.bloom=new W(new F(1,1),.16,.3,.95),this.composer.addPass(this.bloom),this.composer.addPass(new _e)}this.resize(),addEventListener(`resize`,()=>this.resize()),addEventListener(`pointermove`,e=>{this.pointer.set(e.clientX/innerWidth*2-1,e.clientY/innerHeight*2-1)},{passive:!0})}resize(){let e=innerWidth,t=Math.max(innerHeight,document.documentElement.clientHeight);this.width=e,this.height=t,this.mobile=e<820;let n=Math.min(devicePixelRatio||1,this.dprCap);this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.dust.material.uniforms.uPixelRatio.value=n,this.composer&&(this.composer.setPixelRatio(n),this.composer.setSize(e,t),this.bloom.resolution.set(e/2,t/2))}set(e){Object.assign(this.target,e)}jump(){Object.assign(this.state,this.target)}update(e){let t=this.state,n=this.target,r=this.reduced?1:1-Math.exp(-e*3.2);for(let e in n)typeof n[e]==`number`?t[e]+=(n[e]-t[e])*r:t[e]=n[e];this.reduced||(this.time+=e);let i=this.time;this.pointerDamped.lerp(this.pointer,this.reduced?1:1-Math.exp(-e*2));let a=+!this.reduced,o=t.theta+this.pointerDamped.x*.05*a,s=b.clamp(t.phi-this.pointerDamped.y*.03*a,-.2,1.45),c=new I(t.fx,t.ty,t.fz);this.camera.position.set(c.x+Math.sin(o)*Math.cos(s)*t.radius,c.y+Math.sin(s)*t.radius,c.z+Math.cos(o)*Math.cos(s)*t.radius),this.camera.lookAt(c),this.camera.setViewOffset(this.width,this.height,-t.frameX*this.width*.5,t.frameY*this.height*.5,this.width,this.height),this.emblem.position.y=t.emY+Math.sin(i*.8)*.07,this.emblem.rotation.y=o*t.emFollow+Math.sin(i*.35)*.28,this.emblem.rotation.x=Math.sin(i*.5)*.03,this.emblem.scale.setScalar(Math.max(t.emScale,.001)),this.emblem.userData.halo.lookAt(this.camera.position),this.plateHolder.visible=t.plate>.01,this.plateHolder.scale.setScalar(Math.max(t.plate,.001)),this.plateHolder.position.y=t.emY,this.plateHolder.rotation.y=o*t.emFollow,this.plateHolder.rotation.x=-t.plateTilt*1.2,this.plate.rotation.y=i*.12,this.rimRed.intensity=90*t.warmth,this.renderer.toneMappingExposure=1.05*(1-t.dim*.6),this.floor.material.uniforms.uTime.value=i,this.floor.material.uniforms.uWarm.value=.6+t.warmth*.4;let l=this.dust.material.uniforms;l.uTime.value=i,l.uSteam.value=t.steam,l.uOpacity.value=t.dust,this.lite||(je(this.carousel,{index:t.carouselIndex,time:i,visibility:t.carousel,cameraTheta:o}),Ne(this.tower,{visibility:t.tower,level:t.level,time:i}),Ie(this.map,this.floor.material.uniforms,{visibility:t.map,activeKey:t.club,time:i}))}warmUp(){let e=[this.carousel,this.tower,this.map,this.plateHolder].filter(Boolean),t=e.map(e=>e.visible);e.forEach(e=>{e.visible=!0}),this.renderer.compile(this.scene,this.camera),e.forEach((e,n)=>{e.visible=t[n]})}render(){this.paused||(this.composer?this.composer.render():this.renderer.render(this.scene,this.camera))}};export{Le as Stage};