/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved. //im not gonna lie i didn't even know this was here
 *--------------------------------------------------------*/

//const macros = [];

//const funcs = ["function print(...) : void", "function version(void) : String", "function require(type : String) : String"];

//bruh idk if i said this but this is my first time using typescript but i've heard of it before

const funcs:Array<JBSFunc> = [];
const objects:Array<JBSType> = [];

type JBSType = {name: string, info: string, desc: string, type : vscode.CompletionItemKind};//, args: string[]};
type JBSFunc = JBSType & {args : Array<string>};//, args: string[]};
type JBSObject = {varName: string, object : JBSObjects}

type JBSObjects = {props : Array<[string, vscode.CompletionItemKind?]>};

function makeArgs(info : string, desc : string) {
	return {info, desc, args: info.substring(info.indexOf("(")+1, info.indexOf(")")).split(", ")};
}

type SpecialArray = {
	[index: string]: {info: string, desc: string, args: Array<string>}
}

const objectFunctions : SpecialArray = {
	"BeginDraw" : makeArgs("function BeginDraw(void) : void", "calls the native `BeginDraw` function on the direct2d renderTarget"),
	"EndDraw" : makeArgs("function EndDraw(donotpresent? : boolean) : void", "calls the native `EndDraw` function on the direct2d renderTarget  \nthe `donopresent` bool only does anything if this canvas was created with `ID2D1DeviceContext` or `ID2D1DeviceContextDComposition`"),
	"Resize" : makeArgs("function Resize(width : number, height : number) : HRESULT", "resizes the internal RenderTarget  \nIf you're using a D2D11 canvas (`ID2D1DeviceContext` or `ID2D1DeviceContextDComposition`) then you MUST release any bitmaps created with `CreateBitmapFromDxgiSurface` (see )"),
    "CreateSolidColorBrush" : makeArgs("function CreateSolidColorBrush(r : float, g : float, b : float, alpha? : number) : SolidColorBrush", "returns a `Brush` object with 2 unique methods  \n`SetColor` and `GetColor`"),
	"DrawRectangle" : makeArgs("function DrawRectangle(left : number, top : number, right : number, bottom : number, brush : Brush, strokeWidth? : number, strokeStyle? : number) : void", "tells direct2d to draw a rectangle's outline using the arguments"),
	"DrawGradientRectangle" : makeArgs("function DrawGradientRectangle(left : number, top : number, right : number, bottom : number, brush : GradientBrush, gradientRotation? : number | float, strokeWidth? : number, strokeStyle? : number) : void", "convenience method to draw a rectangle's outline as a gradient at the same position, and size"),
	"FillRectangle" : makeArgs("function FillRectangle(left : number, top : number, right : number, bottom : number, brush : Brush) : void", "fills a rectangle starting from the left and top coordinates to the right and bottom coordinates with the brush's color/bitmap/gradient"),
	"FillGradientRectangle" : makeArgs("function FillGradientRectangle(left : number, top : number, right : number, bottom : number, brush : GradientBrush, gradientRotation? : number | float)", "convenience method to fill a rectangle with a gradient brush"),
	"DrawGradientEllipse" : makeArgs("function DrawGradientEllipse", "convenience method to draw an ellipse's outline with a gradient brush"),
	"DrawEllipse" : makeArgs("function DrawEllipse(x : number, y : number, radiusX : number, radiusY : number, brush : Brush, strokeWidth? : number, strokeStyle? : number) : void", "draws the outline of an ellipse with the brush and strokeWidth"),
	"FillEllipse" : makeArgs("function FillEllipse(x : number, y : number, radiusX : number, radiusY : number, brush : Brush) : void", "fills an ellipse at the starting point"),
	"FillGradientEllipse" : makeArgs("function FillGradientEllipse(x : number, y : number, radiusX : number, radiusY : number, brush : GradientBrush, gradientRotation? : number | float) : void", "convenience method to fill an ellipse with a gradient"),
	//"CreateFont" : makeArgs("function CreateFont(fontFamily : string, size : number | float) : TextFormat | Font | {internalPtr : number, family : string, Release : function}", "used in the `DrawText` and `DrawGradientText` methods  \nreturns an object for calling the internal `TextFormat`'s release method"),
	"CreateFont" : makeArgs("function CreateFont(fontFamily : string, size : number | float) : TextFormat | Font", "used in the `DrawText` and `DrawGradientText` methods"),
	"CreateTextLayout" : makeArgs("function CreateTextLayout(text : string, font : TextFormat | Font, maxWidth : float, maxHeight : float) : TextLayout", "font is an object created with `d2d.CreateFont`  \na text layout is sorta like rich text!"),
    
    "DetermineMinWidth" : makeArgs("function DetermineMinWidth() : float", "returns the minimum width of the text layout"),
    "GetDrawingEffect" : makeArgs("function GetDrawingEffect(currentTextPosition : number, startTextPosition? : number, length? : number) : number", "returns the pointer to the drawing effect"),
    "GetFontFamilyName" : makeArgs("function GetFontFamilyName() : wstring", ""),
    "GetFontFamilyNameLength" : makeArgs("function GetFontFamilyNameLength() : number", ""),
    "GetFontSize" : makeArgs("function GetFontSize() : float", ""),
    "GetFontStretch" : makeArgs("function GetFontStretch() : DWRITE_FONT_STRETCH | number", ""),
    "GetFontStyle" : makeArgs("function GetFontStyle() : DWRITE_FONT_STYLE | number", ""),
    "GetFontWeight" : makeArgs("function GetFontWeight() : DWRITE_FONT_WEIGHT | number", ""),
    "GetLineMetrics" : makeArgs("function GetLineMetrics(lines : number) : Array<LineMetrics{}>", ""),
    "GetMaxHeight" : makeArgs("function GetMaxHeight() : float", ""),
    "GetMaxWidth" : makeArgs("function GetMaxWidth() : float", ""),
    "GetMetrics" : makeArgs("function GetMetrics() : TextMetrics{}", ""),
    "GetOverhangMetrics" : makeArgs("function GetOverhangMetrics() : {left : number, right : number, top : number, bottom : number}", ""),
    "GetStrikethrough" : makeArgs("function GetStrikethrough(currentTextPosition : number, startPosition? : number, length? : number) : boolean", ""),
    "GetUnderline" : makeArgs("function GetUnderline(currentTextPosition : number, startPosition? : number, length? : number) : boolean", ""),
    "HitTestPoint" : makeArgs("function HitTestPoint(x : float, y : float) : HitTestMetrics{}", ""),
    "HitTestTextPosition" : makeArgs("function HitTestTextPosition(x : number, y : number) : HitTestMetrics{}", ""),
    "HitTestTextRange" : makeArgs("function HitTestTextRange(textPosition : number, textLength : number, originX : float, originY : float, maxHitTestMetricsCount : number) : Array<HitTestMetrics{}>", ""),
    "SetDrawingEffect" : makeArgs("function SetDrawingEffect(effect : ID2D1Effect, startPosition? : number, length? : number) : void", "effect can be a brush created with `d2d.CreateSolidBrush` or something like that idk it's special"),
    "SetFontFamilyName" : makeArgs("function SetFontFamilyName(fontFamily : wstring, startPosition? : number, length? : number) : void", ""),
    "SetFontSize" : makeArgs("function SetFontSize(size : float) : void", "`size` CANNOT be equal to or less than 0!"),
    "SetFontStretch" : makeArgs("function SetFontStretch(fontStretch : DWRITE_FONT_STRETCH, startPosition? : number, length? : number) : void", ""),
    "SetFontStyle" : makeArgs("function SetFontStyle(fontStyle : DWRITE_FONT_STYLE, startPosition? : number, length? : number) : void", ""),
    "SetFontWeight" : makeArgs("function SetFontWeight(fontWeight : DWRITE_FONT_WEIGHT, startPosition? : number, length? : number) : void", ""),
    "SetMaxHeight" : makeArgs("function SetMaxHeight(maxHeight : number) : void", ""),
    "SetMaxWidth" : makeArgs("function SetMaxWidth(maxWidth : number) : void", ""),
    "SetStrikethrough" : makeArgs("function SetStrikethrough(strikethrough : boolean, startPosition? : number, length? : number) : void", ""),
    "SetUnderline" : makeArgs("function SetUnderline(underline : boolean, startPosition? : number, length? : number) : void", ""),
    
    "DrawText" : makeArgs("function DrawText(text : string, textFormat : TextFormat | Font, left : number, top : number, right : number, bottom : number, brush : Brush) : void", "draws the string `text` with the specified size and brush"),
    "DrawTextLayout" : makeArgs("function DrawTextLayout(x : float, y : float, layout : TextLayout, brush : Brush) : void", "draws the text layout with the specified brush  \n`layout` can be any object created with `d2d.CreateTextLayout`  \naccording to MSDN `DrawTextLayout` is more efficient than DrawText (probably because you can't change the text once you create the layout)"),
	"DrawGradientText" : makeArgs("function DrawGradientText(text : string, textFormat : TextFormat | Font, left : number, top : number, right : number, bottom : number, brush : GradientBrush, gradientRotation? : number | float) : void", "convenience method for drawing text with a gradient brush (don't work as good)"),
	"CreateBitmap" : makeArgs("function CreateBitmap(width : number, height : number) : Bitmap", "creates an empty bitmap with the specified `width` and `height`  \nreturns a custom object with all ID2D1Brush properties besides (`Get`/`Set`)`Transform`"),
	"CreateBitmap1" : makeArgs("function CreateBitmap1(width : number, height : number, bitmapOptions : D2D1_BITMAP_OPTIONS, format? : DXGI_FORMAT, alphaMode? : D2D1_ALPHA_MODE, bits? : Uint8Array, pitch? : number) : Bitmap", "creates a special bitmap with the specified `width` and `height`  \n`bitmapOptions` are any `D2D1_BITMAP_OPTIONS`... const  \n`format` is any `DXGI_FORMAT`... const (but usually `DXGI_FORMAT_B8G8R8A8_UNORM`)  \n`alphaMode` is any `D2D1_ALPHA_MODE`... const (usually `D2D1_ALPHA_MODE_PREMULTIPLIED`)  \n(`pitch`)[https://learn.microsoft.com/en-us/windows/win32/medfound/image-stride] is the amount of bytes in a row of pixel data (including padding)"), //oops you can't actually use the bits parameter yet...
    "CreateBitmapFromDxgiSurface" : makeArgs("function CreateBitmapFromDxgiSurface(bitmapOptions : D2D1_BITMAP_OPTIONS, format? : DXGI_FORMAT, alphaMode? : D2D1_ALPHA_MODE) : Bitmap", "creates a bitmap the size of the render target or something like that  \n`bitmapOptions` are any `D2D1_BITMAP_OPTIONS`... const  \n`format` is any `DXGI_FORMAT`... const (but usually `DXGI_FORMAT_B8G8R8A8_UNORM`)  \n`alphaMode` is any `D2D1_ALPHA_MODE`... const (usually `D2D1_ALPHA_MODE_PREMULTIPLIED`)"), //did i forgot to keep writing this one bruh 😭
    "CreateBitmapFromFilename" : makeArgs("function CreateBitmapFromFilename(filename : string, frame : number) : Bitmap", "**ONLY WORKS IF YOU CREATED `D2D` AND PASSED A `WIC` OBJECT AS THE LAST PARAMETER**  \ncreates a bitmap with the specified image inside (can be .png/.jpg/.bmp/.whatever)  \nif the file specified with filename is a gif `frame` lets you choose which frame of the gif to load   \nreturns a custom object with all ID2D1Brush properties besides (`Get`/`Set`)`Transform`"),
    "CreateBitmapFromWicBitmap" : makeArgs("function CreateBitmapFromWicBitmap(wicBitmap : wicBitmap, release : boolean) : Bitmap", "creates a d2d bitmap from a wic bitmap  \nset release to true if you want to `.Release` the wicBitmap  \nreturns a custom object with all ID2D1Bitmap properties besides (`Get`/`Set`)`Transform`"),
	"DrawBitmap" : makeArgs("function DrawBitmap(bitmap : Bitmap, destLeft? : number, destTop? : number, destRight? : number, destBottom? : number, opacity? : float, bitmapInterpolationMode? : enum D2D1_BITMAP_INTERPOLATION_MODE, srcLeft? : number, srcTop? : number, srcRight? : number, srcBottom? : number) : void", "the `dest` args are where the bitmap will be drawn  \nthe `src` args are how much of the bitmap will be drawn (optional because defaults)  \ninterpolationMode can be any `D2D1_BITMAP_INTERPOLATION_MODE` const"),
	"DrawImage" : makeArgs("function DrawImage(image : Bitmap | Image | Effect, x? : float, y? : float, srcLeft? : float, srcTop? : float, srcRight? : float, srcBottom? : float, interpolationMode? : D2D1_INTERPOLATION_MODE) : void", "interpolationMode can be any `D2D1_INTERPOLATION_MODE` const"),
	"CreateBitmapBrush" : makeArgs("function CreateBitmapBrush(bitmap : Bitmap) : BitmapBrush", "returns a bitmap brush with ykykyk look at `direct2d CreateBitmapBrush msn` dawg"),
	//"CreateGradientStopCollection" : makeArgs("function CreateGradientStopCollection(gradientStops : Array<[position : float, r : float, g : float, b : float, alpha? : float]>) : IUnknown", "creates the gradient stop collection for use in the `Create`(`Linear`/`Radial`)`GradientBrush`  \nreturns the basic IUnknown methods/fields (`Release()`, `internalPtr`)  \nnot sure if the alpha works but that ain't my fault"),
	"CreateGradientStopCollection" : makeArgs("function CreateGradientStopCollection(...gradientStops : [position : float, r : float, g : float, b : float, alpha? : float]) : IUnknown", "creates the gradient stop collection for use in the `Create`(`Linear`/`Radial`)`GradientBrush`  \nreturns the basic IUnknown methods/fields (`Release()`, `internalPtr`)  \nnot sure if the alpha works but that ain't my fault"),
	"CreateLinearGradientBrush" : makeArgs("function CreateLinearGradientBrush(startX : number, startY : number, endX : number, endY : number, gradientStopCollection : GradientStopCollection) : LinearGradientBrush", "creates a linear gradient brush for drawing"),
	"CreateRadialGradientBrush" : makeArgs("function CreateRadialGradientBrush(centerX : number, centerY : number, offsetX : number, offsetY : number, radiusX : number, radiusY : number, gradientStopCollection : GradientStopCollection) : RadialGradientBrush", "creates a radial gradient brush for drawing"),
	"RestoreDrawingState" : makeArgs("function RestoreDrawingState", ""),
	"CreateDrawingStateBlock" : makeArgs("function CreateDrawingStateBlock", ""),
	"SaveDrawingState" : makeArgs("function SaveDrawingState", ""),
	"DrawGradientRoundedRectangle" : makeArgs("function DrawGradientRoundedRectangle(left : number, top : number, right : number, bottom : number, radiusX : number, radiusY : number, gradientBrush : GradientBrush, gradientRotation? : number | float, strokeWidth? : number, strokeStyle? : number) : void", "convenience method to draw centered gradients  \ndraws the outline of a rounded rectangle with the corners rounded by the `radiusX` and `radiusY` properties"),
	"DrawRoundedRectangle" : makeArgs("function DrawRoundedRectangle(left : number, top : number, right : number, bottom : number, radiusX : number, radiusY : number, brush : Brush, strokeWidth? : number, strokeStyle? : number) : void", "draws the outline of a rounded rectangle with the corners rounded by the `radiusX` and `radiusY` properties"),
	"FillRoundedRectangle" : makeArgs("function FillRoundedRectangle(left : number, top : number, right : number, bottom : number, radiusX : number, radiusY : number, brush : Brush) : void", "fills a rounded rectangle with a brush (the corners are rounded by the `radiusX` and `radiusY` properties)"),
	"FillGradientRoundedRectangle" : makeArgs("function FillGradientRoundedRectangle(left : number, top : number, right : number, bottom : number, radiusX : number, radiusY : number, gradientBrush : GradientBrush, gradientAngle : number | float) : void", "convenience method to center the gradient with the rectangle  \nfills a rounded rectangle with the `gradientBrush` (the corners are rounded by the `radiusX` and `radiusY` properties)"),
	"GetSize" : makeArgs("function GetSize(void) : SizeF | {width : number, height : number}", "returns an object with `width` and `height` properties related to the size of this object"),
	"DrawLine" : makeArgs("function DrawLine(fromX : number, fromY : number, toX : number, toY : number, brush : Brush, strokeWidth? : number, strokeStyle? : number) : void", "draws a line starting from (`fromX`, `fromY`) to (`toX`, `toY`)"),
	"DrawGradientLine" : makeArgs("function DrawGradientLine(fromX : number, fromY : number, toX : number, toY : number, brush : GradientBrush, gradientRotation? : float, strokeWidth? : number, strokeStyle? : number) : void", ""),
	"Clear" : makeArgs("function Clear(r : float, g : float, b : float, alphah? : float) : void", "Clears the render target screen with the set color  \ni had to make alpha work in some cases behind the scenes"),
	"Release" : makeArgs("function Release(void) : void", "calls `Release` on this direct2d object and \"deletes\" it"),
    "Flush" : makeArgs("function Flush(tag1 : ptr, tag2 : ptr) : HRESULT", "Executes all pending drawing commands."),
    "GetAntialiasMode" : makeArgs("function GetAntialiasMode() : D2D1_ANTIALIAS_MODE", "returns a `D2D1_ANTIALIAS_MODE...` const"),
    "SetAntialiasMode" : makeArgs("function SetAntialiasMode(AAmode : D2D1_ANTIALIAS_MODE) : void", "AAmode is any `D2D1_ANTIALIAS_MODE...` const"),
    "GetMaximumBitmapSize" : makeArgs("function GetMaximumBitmapSize(void) : number", "i wonder how big it can be"),
    "SetDpi" : makeArgs("function SetDpi(x : number, y : number) : void", "idk bro"),
    //"windowProc" : makeArgs("function windowProc(hwnd : HWND | number, message : number) : void", "uhhh think of the winProc on regular c++ windows"),
    //"loop" : makeArgs("function loop(void) : void", "this is called when the window is not handling any events"),
    "SetOpacity" : makeArgs("function SetOpacity(opacity : float) : void", "sets the opacity of the brush"),
    "GetOpacity" : makeArgs("function GetOpacity(void) : float", "gets the opacity of the brush"),
    "GetTransform" : makeArgs("function GetTransform(void) : Matrix3x2F", "gets the matrix object"),
    "SetTransform" : makeArgs("function SetTransform(matrix : Matrix3x2F) : void", "sets the transform of this brush (only used for bitmap brushes or gradients)  \n`matrix` can be one gained from `GetTransform` or most `d2d.Matrix3x2F...` functions"),
    "GetDpi" : makeArgs("function GetDpi(void) : number[2]", "returns an array with the first element being the xDpi and the second being the yDpi"),
    "GetPixelFormat" : makeArgs("function GetPixelFormat(void) : {format : number, alphaMode : number}", "`format` is any `DXGI_FORMAT_` const  \n`alphaMode` is any `D2D1_ALPHA_MODE_` const"),

    //default brush funcs
    "GetPixelSize" : makeArgs("function GetPixelSize(void) : {width : number, height : number}", "returns an object with pixelWidth and pixelHeight fields/properties ig about this brush"),
    //"GetSize" : makeArgs("function GetSize(void) : {width : number, height : number}", "returns an object with width and height fields/properties ig about this brush"),
    "CopyFromBitmap" : makeArgs("function CopyFromBitmap(startX : number, startY : number, bmp : ID2D1Bitmap, srcLeft : number, srcTop : number, srcRight : number, srcBottom : number) : number", "copies the supplied `bmp` into this bmp  \nreturns 0 or an HRESULT code if failed"),
    "CopyFromRenderTarget" : makeArgs("function CopyFromRenderTarget(startX : number, startY : number, renderTarget : ID2D1RenderTarget | number, srcLeft : number, srcTop : number, srcRight : number, srcBottom : number) : void", "copies the supplied `renderTarget` into this bmp"),
    "CopyFromMemory" : makeArgs("function CopyFromMemory(srcLeft : number, srcTop : number, srcRight : number, srcBottom : number, data : Uint32Array) : void", "copied the supplied `renderTarget` into this bmp"),
    "SetColor" : makeArgs("function SetColor(r : float, g : float, b : float, a : float) : void", "sets the color of this brush  \nunlike the GDI drawing function `r`,`g`,`b`,and `a` must be from 0-1 as decimals"),
    "GetBit" : makeArgs("function GetBit(i : number) : RGBA", "`i` is the index  \nreturns an `RGBA` value which is basically RGB (and you can use the `GetRValue`... functions on it) but see `updatelayeredwindow(dibits).js` for a definition of RGBA"),
    "SetBit" : makeArgs("function SetBit(i : number, color : RGBA) : void", "`i` is the index  \n`color` is an `RGBA` value which is defined in `updatelayeredwindow(dibits).js`"),
    "GetBits" : makeArgs("function GetBits(void) : Uint32Array", "returns the DIB as an Uint32Array for use with `StretchDIBits` or `SetDIBitsToDevice`"),
    "SetBits" : makeArgs("function SetBits(bits : Uint32Array) : void", "bits can be a Uint32Array gained from `dib.GetBits` or `GetDIBits`"),
    "LoadBitmapFromFilename" : makeArgs("function LoadBitmapFromFilename(filename : wstring | string, format : GUID, frameNumber? : number) : wicConverter*", "format can be any `GUID_`... const (you must use `ScopeGUIDs` before accessing any `GUID_`... const)  \nreturns a wicConverter object for use with d2d.`CreateBitmapFromWicBitmap`"),
    //"LoadBitmapFromStream" : makeArgs("function LoadBitmapFromStream(filestream : wstring | string, format : GUID, frameNumber : number) : wicConverter*", "filestream can be a string of bytes like when reading a .png file with `fs.read`  \nformat can be any `GUID_`... const (you must use `ScopeGUIDs` before accessing any `GUID_`... const)  \nreturns a wicConverter object for use with d2d.`CreateBitmapFromWicBitmap`"),
    "LoadDecoder" : makeArgs("function LoadDecoder(filename : wstring | string) : wicDecoder*", "returns a wicDecoder object for use with wicDecoder.`GetBitmapFrame`"),
    "GetPixels" : makeArgs("function GetPixels(wic : any, transformOption? : WICBitmapTransformOptions) : Uint32Array", "returns a large Uint32Array (for use with `StretchDIBits` or `CreateBitmap`)  \nwic is an object created with `InitializeWIC()`  \ntransformOption is any `WICBitmapTransform`... const"),
    "GetResolution" : makeArgs("function GetResolution(void) : {x : float, y : float}", "returns the dpi of this bitmap"),
    "GetFrameCount" : makeArgs("function GetFrameCount(void) : number", "returns the amount of frames in the decoder (i use this in `newwicfuncs.js`)"),
    "GetBitmapFrame" : makeArgs("function GetBitmapFrame(wic : any, frameNumber : number, format : GUID) : number", "wic is an object created with `InitializeWIC()`  \nformat can be any `GUID_`... const (you must use `ScopeGUIDs` before accessing any `GUID_`... const)"),
    "GetThumbnail" : makeArgs("function GetThumbnail(void) : wicBitmap*", "Note: according to MSDN GetThumbnail only works on JPEG, TIFF, and JPEG-XR formats  \nreturns a wicBitmap (which is equal to a wicConverter*) object for use with d2d.`CreateBitmapFromWicBitmap`"),
    "GetPreview" : makeArgs("function GetPreview(void) : wicBitmap*", "ok im not gonna lie this function might not work in 99% of cases  \nreturns a wicBitmap (which is equal to a wicConverter*) object for use with d2d.`CreateBitmapFromWicBitmap`"),
    //"GetPixelFormat" : makeArgs("function GetPixelFormat(void) : GUID", "returns the GUID used to make this wicBitmap"),
    "GetContainerFormat" : makeArgs("function GetContainerFormat(void) : GUID", "returns the GUID associated with this decoder"),
    "ConvertBitmapSource" : makeArgs("function ConvertBitmapSource(dstFormat : GUID, srcBitmap : wicBitmap) : wicBitmap", "converts the srcBitmap to the dstFormat  \nreturns a bitmap with the specified format"),
    //"Resize" : makeArgs("function Resize(wic : any, newWidth : number, newHeight : number, interpolationMode : WICBitmapInterpolationMode) : void", "VOID NIGGAR"),
    "CreateBitmapFromHBITMAP" : makeArgs("function CreateBitmapFromHBITMAP(srcBitmap : HBITMAP, palette? : number, alphaMode : WICBitmapAlphaChannelOption, format : GUID) : IWICBitmap", "srcBitmap must be an HBITMAP (for example one gained from `CreateDIBSection()`.bitmap)  \npalette may be NULL if there was no palette used to create the srcBitmap  \nalphaMode can be any `WICBitmapAlphaChannelOption`... const  \nformat can be any `GUID_`... const (you must use `ScopeGUIDs` before accessing any `GUID_`... const)"),
    "CreateBitmapFromHICON" : makeArgs("function CreateBitmapFromHICON(srcIcon : HICON, format : GUID) : IWICBitmap", "srcIcon must be an HICON (for example one gained from `CreateIconIndirect()`)  \nformat can be any `GUID_`... const (you must use `ScopeGUIDs` before accessing any `GUID_`... const)"),
    "LoadBitmapFromBinaryData" : makeArgs("function LoadBitmapFromBinaryData(binary : ArrayBuffer, format : GUID, frameNumber : number, container : GUID) : wicBitmap", "`binary` can be a buffer gained from `require('fs')`'s `readBinary` function  \nformat and container can be any `GUID_`... const (you must use `ScopeGUIDs` before accessing any `GUID_`... const)"),
    "CreateEffect" : makeArgs("function CreateEffect(effect : GUID) : ID2D1Effect", "CreateEffect can ONLY be used with a canvas created with `ID2D1DeviceContext` or `ID2D1DeviceContextDComposition`"),
    "EnumFonts" : makeArgs("function EnumFonts(func : Function<FontFamily>, passFontFamilyObjects? : bool) : void", "enumerates system font families (the DirectWrite way)  \nslightly different from GDI's `EnumFontFamilies`  \nwhen `passFontFamilyObjects` is false it will only pass the name of the font family (so no having to manually release the FontFamily object) but if it's true then you MUST release the FontFamily objects once you're done with them (see `d2dfontenum.js`)"),
};

//aw shoot at some point i gotta write a way for this to differentiate between createCanvas("d2d") and createCanvas("opengl")

function registerFunc(name : string, info : string, desc : string = "") {//, args: string[]) {
	//const shit : JBSType = ;
	funcs.push({name, info, desc, type: 2, args: info.substring(info.indexOf("(")+1, info.indexOf(")")).split(", ")});
}

function registerGlobalObject(name : string, info : string, desc : string = "") {//, args: string[]) {
	//const shit : JBSType = ;
	objects.push({name, info, desc, type: 6});
}

//#region 
registerFunc("print", "function print(...) : void", "replacement for `console.log` because it no work");
registerFunc("printNoHighlight", "function printNoHighlight(...) : void", "basically print but doesn't do automatic highlighting (like when you use `print` on a string it's blue in the console)");
registerFunc("wprint", "function wprint(...) : void", "print but for Utf16 (wchar_t)  \nbasically can sorta print emojis i guess");
registerFunc("version", "function version(void) : string", "returns the version of v8 in string form");
registerFunc("require", "function require(type : string) : Object", "returns a special object  \nusing `fs` gives you an object with `read` and `write` methods");
registerFunc("nigg", "function nigg(void) : string", "returns `\"er\"`");
registerFunc("system", "function system(command : wstring, textType? : wstring) : wstring", "runs the specified `command` in command prompt  \nreturns the stdout (output) of the command  \ntextType can be rt (read text) or rb (read binary)");
registerFunc("setBackground", "function setBackground(filename : string) : bool", "sets the desktop background to the specified file  \nreturns true if it worked");

registerGlobalObject("file", "an object with convenience methods related to its file", "the only property is `file` which returns the file name");
registerGlobalObject("hInstance", "the hInstance associated with this process", "i mean yeah this is JBS3's HINSTANCE");
registerGlobalObject("screenWidth", "the screen's width", "obtained with `GetSystemMetrics(SM_CXSCREEN)`");
registerGlobalObject("screenHeight", "the screen's height", "obtained with `GetSystemMetrics(SM_CYSCREEN)`");
registerGlobalObject("__dirname", "this file's directory", "think node js!");
registerGlobalObject("args", "the arguments used to start this file", "think something like process.argv[] node js!");
registerGlobalObject("nCmdShow", "straight from WinMain", "use this with `ShowWindow`");

registerFunc("Msgbox", "function Msgbox(description : string, title : string, flags : number) : number", "calls the `windows.h` `MessageBoxW` function  \nthe flags are all the `MB_` constants (can be OR'ed together)  \nreturns a number based on the user's choice");
registerFunc("Inputbox", "function Inputbox(description : string, title : string, placeholder : string) : string", "returns the text the user submitted or none if they `cancelled`");

//registerFunc("CreateWindowClass", "function CreateWindowClass(className : string, init : function, windowProc : function, loop : function) : wndclass | {className : string, windowProc : function, loop : function}", "returns an object with these 3 properties/methods for use with `CreateWindow`");
//registerFunc("CreateWindowClass", "function CreateWindowClass(className? : string, init? : function, windowProc? : function, loop? : function) : WNDCLASSEXA", "returns an object for use with `CreateWindow`  \nyou can use this object like its c++ `WNDCLASSEX` counterpart");
registerFunc("CreateWindowClass", "function CreateWindowClass(className? : string, windowProc? : function, loop? : function) : WNDCLASSEXW", "returns an object for use with `CreateWindow`  \nyou can use this object like its c++ `WNDCLASSEX` counterpart");
//registerFunc("CreateWindow", "function CreateWindow(wndclass : {className : string, windowProc : function, loop : function}, title : string, x : number, y : number, width : number, height : number) : Promise", "returns a promise that is resolved when the window closes");
//registerFunc("CreateWindow", "function CreateWindow(wndclass : WNDCLASSEXA | string, title : string, windowStyles : number, x : number, y : number, width : number, height : number) : HWND | number", "the `wndclass` can be an object created with the `CreateWindowClass` function or a string like `BUTTON` or `CONTROL` ((MSDN link for all special classes)[https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw#remarks])  \nthe windowProc will NOT call WM_CREATE because IDK DAWG just use init  \nwindowStyles can be any `WS_` const (can be OR'd together `|` )  \nreturns the pointer to the newly created window (`HWND`)");
registerFunc("CreateMenu", "function CreateMenu(void) : HMENU", "Creates a menu. The menu is initially empty, but it can be filled with menu items by using the `AppendMenu` function");
registerFunc("SetMenu", "function SetMenu(window : HWND, menu : HMENU) : BOOL", "Assigns a new menu to the specified window.");
registerFunc("RemoveMenu", "function RemoveMenu(menu : HMENU, position : number, flags : MF_BY...) : BOOL", "Deletes a menu item or detaches a submenu from the specified menu.  \n**RemoveMenu** does not destroy the menu or its handle, allowing the menu to be reused.  \n`flags` can be any `MF_BY`... const");
registerFunc("AppendMenu", "function AppendMenu(menu : HMENU, flags : MF_..., id : number, name : wstring) : BOOL", "Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu. You can use this function to specify the content, appearance, and behavior of the menu item.  \n`flags` can be any `MF`..., `MFT`..., or `MFS`... const");
registerFunc("DestroyMenu", "function DestroyMenu(menu : HMENU) : BOOL", "Destroys the specified menu and frees any memory that the menu occupies.");
registerFunc("DeleteMenu", "function DeleteMenu(menu : HMENU, position : number, flags : MF_BY...) : BOOL", "`flags` can be any `MF_BY`... const");
registerFunc("DrawMenuBar", "function DrawMenuBar(hwnd : HWND | number) : BOOL", "Redraws the menu bar of the specified window. If the menu bar changes after the system has created the window, this function must be called to draw the changed menu bar.");
registerFunc("CreatePopupMenu", "function CreatePopupMenu(void) : HMENU", "Creates a drop-down menu, submenu, or shortcut menu. The menu is initially empty.  \nYou can insert or append menu items by using the `InsertMenuItem` function.  \nYou can also use the `InsertMenu` function to insert menu items and the `AppendMenu` function to append menu items.  \nsee customcontextmenu.js");
registerFunc("InsertMenu", "function InsertMenu(hMenu : HMENU, position : number, flags : MF_..., id : number, item : number | string) : BOOL", "`flags` can be any `MF_`... const (some can be OR'ed together)  \ndepending on the flags, `item` can be a string (when `flags` include `MF_STRING`) or a bitmap (when `flags` include `MF_BITMAP`)");
registerFunc("ModifyMenu", "function ModifyMenu(hMenu : HMENU, position : number, flags : MF_..., id : number, item : number | string) : BOOL", "Changes an existing menu item. This function is used to specify the content, appearance, and behavior of the menu item.  \n`flags` can be any `MF_`... const (some can be OR'ed together)  \ndepending on the flags `item` can be a string (when `flags` include `MF_STRING`) or a bitmap (when `flags` include `MF_BITMAP`)  \nfor more advanced info use `SetMenuItemInfo`");
registerFunc("CheckMenuItem", "function CheckMenuItem(hMenu : HMENU, position : number, flags : MF_...) : DWORD", "`flags` can be (`MF_BYCOMMAND`, `MF_BYPOSITION`, `MF_CHECKED`, `MF_UNCHECKED`) and can be OR'ed together  \nreturns the previous state of this menu item");
registerFunc("InsertMenuItem", "function InsertMenuItem(hMenu : HMENU, position : number, fByPosition : boolean, menuItemInfo : MENUITEMINFO | {}) : BOOL", "  \n`menuItemInfo` is pretty weird see `customcontextmenu.js` for usage bruh (or check [here](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-menuiteminfow))");
registerFunc("GetMenuItemInfo", "function GetMenuItemInfo(hMenu : HMENU, position : number, fByPosition : boolean, menuItemInfo : MENUITEMINFO | {}) : BOOL", "  \n`menuItemInfo` is an object containing an fMask key which specifies which values to be returned by this function  \nsee `customcontextmenu.js`");
registerFunc("SetMenuItemInfo", "function SetMenuItemInfo(hMenu : HMENU, position : number, fByPosition : boolean, menuItemInfo : MENUITEMINFO | {}) : BOOL", "  \n`menuItemInfo` is pretty weird see `customcontextmenu.js` for usage bruh (or check [here](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-menuiteminfow))");
registerFunc("TrackPopupMenu", "function TrackPopupMenu(hMenu : HMENU, uFlags : `TPM_...`, x : number, y : number, hwnd : HWND | number) : BOOL", "`uFlags` can be any `TPM_`... const (can be OR'ed together)  \nDisplays a shortcut menu at the specified location and tracks the selection of items on the menu. The shortcut menu can appear anywhere on the screen.");
registerFunc("TrackPopupMenuEx", "function TrackPopupMenuEx(hMenu : HMENU, uFlags : `TPM_...`, x : number, y : number, hwnd : HWND | number, rcExclude : RECT | {}) : BOOL", "`uFlags` can be any `TPM_`... const (can be OR'ed together)  \n  `rcExclude` must be an object with `{left, right, top, bottom}` keys and when specified the menu will not intersect that area i think  \nDisplays a shortcut menu at the specified location and tracks the selection of items on the shortcut menu. The shortcut menu can appear anywhere on the screen.");
registerFunc("GET_MEASURE_ITEM_STRUCT_LPARAM", "function GET_MEASURE_ITEM_STRUCT_LPARAM(lp : LPARAM | number) : {CtlType, CtlID, itemID, itemWidth, itemHeight, itemData}", "used with the `WM_MEASUREITEM` window message  \nreturns an object with many keys (all the values are numbers)  \n`CtlType` can be one `ODT`... const  \n`CtlID` is the id of the combo box or list box (if this is a menu item use `itemID`)  \n`itemID` is the id for a menu item or the position of a list box or combo box item. This value is specified for a list box only if it has the LBS_OWNERDRAWVARIABLE style; this value is specified for a combo box only if it has the CBS_OWNERDRAWVARIABLE style.  \n`itemWidth` is the width of this menu item. You must set this number.  \n`itemHeight` is the height of this menu item. You must set this number.  \n`itemData` is the application-defined value associated with the menu item. (when using `InsertMenu` it's the last parameter)  \nI used some proxy trickery so that when you set these values it directly changes the values lp points to");
registerFunc("GET_DRAW_ITEM_STRUCT_LPARAM", "function GET_DRAW_ITEM_STRUCT_LPARAM(lp : LPARAM | number) : {CtlType, CtlID, itemID, itemAction, itemState, hwndItem, hDC, rcItem, itemData}", "used with the `WM_DRAWITEM` window message  \nreturns an object with many keys  \n`CtlType` can be one `ODT`... const  \n`CtlID` is the id of the combo box or list box (if this is a menu item use `itemID`)  \n`itemID` is the id for a menu item or the position of a list box or combo box item. This value is specified for a list box only if it has the LBS_OWNERDRAWVARIABLE style; this value is specified for a combo box only if it has the CBS_OWNERDRAWVARIABLE style.  \n`itemAction` can be one or more `ODA_`... consts  \n`itemState` can be one or more `ODS_`... consts  \n`hwndItem` is a handle to the control for combo boxes, list boxes, buttons, and static controls. For menus, this member is a handle to the menu that contains the item.  \n`hDC` is the device context to draw onto  \n`rcItem` all drawing (with the exception of menu items) is clipped within this RECT  \n`itemData` is the application-defined value associated with the menu item. (when using `InsertMenu` it's the last parameter)");
registerFunc("CreateWindow", "function CreateWindow(extendedStyle : number, wndclass : WNDCLASSEXW | string, title : string, windowStyles : number, x : number, y : number, width : number, height : number, hwndParent? : HWND | number, hMenu? : HMENU | number, hInstance? : HINSTANCE | number) : HWND | number", "the extendedStyles can be any `WS_EX_` const (can be OR'd together)  \nthe `wndclass` can be an object created with the `CreateWindowClass` function or a string like `BUTTON` or `CONTROL` ([MSDN link for all special classes](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw#remarks))  \nwindowStyles can be any `WS_` const (can be OR'd together `|` )  \n**IF YOU ARE TRYING TO USE DCOMPOSITION, CREATE THIS WINDOW WITH THE `WS_EX_NOREDIRECTIONBITMAP` EXTENDED FLAG!!!**\n  \nreturns the pointer to the newly created window (`HWND`)  \nunfortunately RIGHT when you make the window the following messages aren't sent:  \n`WM_GETMINMAXINFO`  \n`WM_NCCALCSIZE`  \n`WM_SHOWWINDOW`  \n`WM_WINDOWPOSCHANGING`  \n`WM_ACTIVATEAPP`  \n`WM_NCACTIVATE`  \n`WM_GETICON`  \n`WM_ACTIVATE`  \n`WM_IME_SETCONTEXT`  \n`WM_SETFOCUS`  \n`WM_NCPAINT`  \n`WM_ERASEBKGND`  \n`WM_WINDOWPOSCHANGED`  \n`WM_SIZE`  \n`WM_MOVE`  \nin that order (but don't worry you can still receive these messages later just not when the window is created)"); //nevermind: if `winclass` is an object from `CreateWindowClass` and this is the first window created with one, **it will block the thread after this call.** Further `CreateWindow` calls will not block the thread.  \n
registerFunc("RedrawWindow", "function RedrawWindow(hwnd : HWND | number, left : number, top : number, right : number, bottom : number, hrgnUpdate : HRGN | number | undefined, flags : number) : number", "can immediately redraw the window like `UpdateWindow`  \n  the flags can be any `RDW_` const (can be OR'd together)  \nreturns 0 if failed"); //https://stackoverflow.com/questions/2325894/difference-between-invalidaterect-and-redrawwindow
registerFunc("InvalidateRect", "function InvalidateRect(hwnd : HWND | number, left : number, top : number, right : number, bottom : number, bErase : boolean) : number", "calls the native `InvalidateRect` which \"schedules\" a redraw  \nreturns 0 if failed");
registerFunc("ShowWindow", "function ShowWindow(hwnd : HWND | number, nCmdShow : number) : number", "nCmdShow can be any `SW_` const  \nreturns 0 if failed");
registerFunc("UpdateWindow", "function UpdateWindow(hwnd : HWND | number) : number", "immediately redraws the window  \nreturns 0 if failed");
registerFunc("EnableWindow", "function EnableWindow(hwnd : HWND | number, bEnable : boolean) : number", "usually used for edit windows or combo boxes i think  \nreturns 0 if failed");
registerFunc("SetRect", "function SetRect(rect : RECT, left : number, top : number, right : number, bottom : number) : void", "the `left`,`top`,`right`,`bottom` parameters are copied into `rect` and this function returns nothing  \nthere isn't really a point in using this one and i only made it for `msnexample.js`");
registerFunc("ClientToScreen", "function ClientToScreen(hwnd : HWND | number, &point : {x : number, y : number}) : void", "the new screen point will be copied into `point` and this function returns nothing");
registerFunc("ScreenToClient", "function ScreenToClient(hwnd : HWND | number, &point : {x : number, y : number}) : void", "the new client point will be copied into `point` and this function returns nothing");
registerFunc("SetROP2", "function SetROP2(dc : HDC | number, rop2 : number) : number", "`rop2` can be any `R2_` const  \nreturns 0 if failed");
registerFunc("GetROP2", "function GetROP2(dc : HDC | number) : number", "returns any `R2_` const");
registerFunc("MAKEROP4", "function MAKEROP4(fore : number, back : number) : number", "`fore` and `back` can be any `SRC...` const  \nonly used for MaskBlt  \n[heres a doc describing more ROP codes](https://learn.microsoft.com/en-us/windows/win32/gdi/ternary-raster-operations?redirectedfrom=MSDN)");

registerFunc("BeginPaint", "function BeginPaint(window? : HWND | number) : PaintStruct | object", "calls the `windows.h` `BeginPaint` function  \nreturns a newly created custom object with the original c++ `PAINTSTRUCT` object's methods  \n**don't forget to call EndPaint or else memory leak :3**"); //meant to write :) but whatever (lol this just jumpscared me)
registerFunc("EndPaint", "function EndPaint(window? : HWND | number, paintstruct : PaintStruct | object) : void", "calls the `windows.h` `EndPaint` function  \ndeletes the paintstruct object");
registerFunc("CreateRectRgn", "function CreateRectRgn(x1 : number, y1 : number, x2 : number, y2 : number) : HRGN | number", "creates an HRGN object behind the scenes and returns a pointer to it  \nused in functions like `GetDCEx`");
registerFunc("SetRectRgn", "function SetRectRgn(hrgn : HRGN | number, left : number, top : number, right : number, bottom : number) : BOOL", "The `SetRectRgn` function converts a region into a rectangular region with the specified coordinates.  \n`hrgn` can be created using `CreateRectRgn` or used in the `WM_NCPAINT` window message as the wParam");
registerFunc("GetRgnBox", "function GetRgnBox(rgn : HRGN | number) : RECT | {left, top, right, bottom, complexity}", "`rgn` can be created using `CreateRectRgn` or used in the `WM_NCPAINT` window message as the wParam  \nunlike other RECT returning functions, `GetRgnBox` returns a RECT object with an additional property: `complexity`  \n`complexity` can be `NULLREGION`, `SIMPLEREGION`, or `COMPLEXREGION`");
registerFunc("PaintRgn", "function PaintRgn(hDC : HDC | number, hrgn : HRGN | number) : BOOL", "The `PaintRgn` function paints the specified region by using the brush currently selected into the device context.  \n`hrgn` can be created using `CreateRectRgn` or used in the `WM_NCPAINT` window message as the wParam");
registerFunc("FillRgn", "function FillRgn(hDC : HDC | number, hrgn : HRGN | number, brush : HBRUSH | number) : BOOL", "The `FillRgn` function fills a region by using the specified brush.  \n`hrgn` can be created using `CreateRectRgn` or used in the `WM_NCPAINT` window message as the wParam");
registerFunc("EqualRgn", "function EqualRgn(hrgn1 : HRGN | number, hrgn2 : HRGN | number) : BOOL", "The `EqualRgn` function checks the two specified regions to determine whether they are identical. The function considers two regions identical if they are equal in size and shape.  \nan `HRGN` can be created using `CreateRectRgn` or used in the `WM_NCPAINT` window message as the wParam");
registerFunc("FrameRgn", "function FrameRgn(hDC : HDC | number, hrgn : HRGN | number, brush : HBRUSH | number, w : number, h : number) : BOOL", "The `FrameRgn` function draws a border around the specified region by using the specified brush.  \n`hrgn` can be created using `CreateRectRgn` or used in the `WM_NCPAINT` window message as the wParam");
registerFunc("GetDCEx", "function GetDCEx(window? : HWND | number, hrgnClip : HRGN | number, flags : number) : HDC | number", "calls the `windows.h` `GetDCEx` function  \nhrgnClip can be created using `CreateRectRgn` or used in the `WM_NCPAINT` window message as the wParam  \nflags are any `DCX_` const (can be OR'd together)  \nreturns the pointer (integer in js) to the HDC in c++");
registerFunc("GetDC", "function GetDC(window? : HWND | number) : HDC | number", "calls the `windows.h` `GetDC` function  \nreturns the pointer (integer in js) to the HDC in c++");
registerFunc("GetWindowDC", "function GetWindowDC(window : HWND | number) : HDC | number", "calls the `windows.h` `GetWindowDC` function which gets the ENTIRE window's device context including the titlebar (well that was a lie but it does include scrollbars)  \nreturns the pointer (integer in js) to the HDC in c++");
registerFunc("SaveDC", "function SaveDC(dc : HDC | number) : number", "calls the `windows.h` `SaveDC` function  \nreturns saved state's position for use with `RestoreDC`");
registerFunc("RestoreDC", "function RestoreDC(dc : HDC | number, savedState : number) : number", "calls the `windows.h` `RestoreDC` function  \nreturns 0 if failed");
registerFunc("DeleteDC", "function DeleteDC(dc : HDC | number) : number", "calls the `windows.h` `usually used on compatible DCs  \nDeleteDC` function  \nreturns 0 if failed");
registerFunc("CreateCompatibleDC", "function CreateCompatibleDC(dc : HDC | number) : HDC | number", "calls the `windows.h` `CreateCompatibleDC` function  \nusually used to draw/manipulate a bitmap (but you can draw TO a bitmap as well)  \napparently faster to draw to according to [this answer](https://stackoverflow.com/questions/53958727/performance-efficient-way-of-setting-pixels-in-gdi)  \nreturns the pointer to the HDC in c++");
registerFunc("CreateCompatibleBitmap", "function CreateCompatibleBitmap(dc : HDC | number, width : number, height : number) : HBITMAP | number", "calls the `windows.h` `CreateCompatibleBitmap` function (apparently draws faster than bitmaps created with `CreateBitmap`)  \nreturns the pointer to the HBITMAP in c++");
registerFunc("ReleaseDC", "function ReleaseDC(window? : HWND | number, dc : HDC | number) : any | number", "calls the `windows.h` `ReleaseDC` function  \nreturns what ever the native c++ function returns idk probably 0");
registerFunc("TextOut", "function TextOut(dc : HDC | number, x : number, y : number, text : string) : any | number", "calls the `windows.h` `TextOutW` function  \nreturns what ever the native c++ function returns");
registerFunc("DrawText", "function DrawText(dc : HDC | number, text : string, left : number, top : number, right : number, bottom : number, format : number) : number", "the format can be any `DT_` const (can be OR'd together)  \nreturns 0 if failed");
registerFunc("CreateFont", "function CreateFont(cHeight : number, cWidth : number, cEscapement : number, cOrientation : number, cWeight : number, bItalic : boolean, bUnderline : boolean, bStrikeOut : boolean, iCharSet : number, iOutPrecision : number, iClipPrecision : number, iQuality : number, iPitchAndFamily : number, pszFaceName? : string) : number", "`cWeight` can be any `FW_` const  \n`iCharSet` can be any ...`_CHARSET` const  \niOutPrecision can be any `OUT_` const  \niClipPrecision can be any `CLIP_` const  \niQuality can be any ...`_QUALITY` const  \niPitchAndFamily can be any ...`_PITCH` | `FF_` consts");
registerFunc("EnumFontFamilies", "function EnumFontFamilies(dc : HDC | number, func : Function(font : LOGFONT, textMetric : TEXTMETRIC, FontType : number)) : void", "takes a function with 3 parameters  \ncalls the native `EnumFontFamiliesExA` function");
registerFunc("CreateFontSimple", "function CreateFontSimple(fontName : string, width : number, height : number) : HFONT | number", "a convenience function because `CreateFont` takes like 30 arguments  \n`fontName` is case-insensitive so \"Impact\" or \"impact\" will work");
registerFunc("AddFontResourceEx", "function AddFontResourceEx(path : wstring, flag : number) : number", "The `AddFontResourceEx` function adds the font resource from the specified file to the system. Fonts added with the `AddFontResourceEx` function can be marked as private and not enumerable.  \nafter adding a font you can use its name (as shown in the file) with `CreateFontSimple` and can be found at the end of `EnumFontFamilies`  \n`flag` can be one of the `FR_`... consts (or null?)  \n`path` can be any file with these extensions:  \n* .fon  \n* .fnt  \n* .ttf  \n* .ttc  \n* .fot  \n* .otf  \n* .mmm  \n* .pfb  \n* .pfm  \nreturns the number of fonts added or 0 if failed");
registerFunc("RemoveFontResourceEx", "function RemoveFontResourceEx(path : wstring, flag : number) : BOOL", "`path` and `flag` must be the same as when you called `AddFontResourceEx`!  \n`flag` can be one of the `FR_`... consts (or null?)");
//registerFunc("StretchDIBits", "function StretchDIBits(dc : HDC | number, xDest : number, yDest : number, DestWidth : number, DestHeight : number, xSrc : number, ySrc : number, SrcWidth : number, SrcHeight : number, data : number[], imageWidth : number, imageHeight : number, compression : number, rop : number) : number", "data can be any png or jpeg file read with `fs.readBinary`  \ncompression can be any `BI_` const  \nrop can be any `SRC` const (or `NOTSRC` consts lol)  \nreturns 0 if failed");
registerFunc("StretchDIBits", "function StretchDIBits(dc : HDC | number, xDest : number, yDest : number, DestWidth : number, DestHeight : number, xSrc : number, ySrc : number, SrcWidth : number, SrcHeight : number, data : Uint32Array, imageWidth : number, imageHeight : number, bitCount : number, compression : number, rop : number) : number", "compression can be any `BI_` const (but 99/100 times it's gonna be `BI_RGB`)  \nrop can be any `SRC` const (or `NOTSRC` consts lol)  \ndata must be an array made with `new Uint32Array([data])` (because it's fast) OR can be from `GetDIBits` or wicBitmap.`GetPixels()`  \nreturns 0 if failed");
registerFunc("CreatePatternBrush", "function CreatePatternBrush(bitmap : HBITMAP | number) : HBRUSH | number", "creates a brush with the bitmap as a pattern  \nreturns 0 if failed");
registerFunc("CreateHatchBrush", "function CreateHatchBrush(hatchMode : number, color : RGB | number) : HBRUSH | number", "hatchMode can be any `HS_`  \nuse SetBkMode to make it `TRANSPARENT` or `OPAQUE`  \ncolor must be an `RGB()` value  \nreturns 0 if failed");
registerFunc("GetCurrentObject", "function GetCurrentObject(dc : HDC | number, type : number) : HGDIOBJ | number", "the `type` can be any `OBJ_`... const ([see here](https://learn.microsoft.com/en-us/windows/win32/api/wingdi/nf-wingdi-getcurrentobject))");
registerFunc("GetObjectType", "function GetObjectType(obj : HGDIOBJ | number) : number", "returns any `OBJ_`... const based on what type of `obj` it is lol");
registerFunc("GetDCOrgEx", "function GetDCOrgEx(dc : HDC | number) : {x : number, y : number}", "The GetDCOrgEx function retrieves the final translation origin for a specified device context (DC). The final translation origin specifies an offset that the system uses to translate device coordinates into client coordinates (for coordinates in an application's window).");
registerFunc("FrameRect", "function FrameRect(dc : HDC | number, left : number, top : number, right : number, bottom : number, brush : HBRUSH | number) : BOOL", "The `FrameRect` function draws a border around the specified rectangle by using the specified brush. The width and height of the border are always one logical unit.  \nreturns 1 if success");
registerFunc("InvertRect", "function InvertRect(dc : HDC | number, left : number, top : number, right : number, bottom : number) : BOOL", "The `InvertRect` function inverts a rectangle in a window by performing a logical NOT operation on the color values for each pixel in the rectangle's interior.  \nreturns 1 if success");
registerFunc("PaintDesktop", "function PaintDesktop(dc : HDC | number) : BOOL", "The PaintDesktop function fills the clipping region in the specified device context with the desktop pattern or wallpaper. The function is provided primarily for shell desktops.  \ni think it just draws the desktop's background to the DC (but if the bitmap isn't big enough it gets clipped)  \nreturns 1 if success");
registerFunc("Pie", "function Pie(dc : HDC | number, left : number, top : number, right : number, bottom : number, xr1 : number, yr1 : number, xr2 : number, yr2 : number) : BOOL", "The `Pie` function draws a pie-shaped wedge bounded by the intersection of an ellipse and two radials. The pie is outlined by using the current pen and filled by using the current brush.  \nreturns 1 if success");
registerFunc("GradientFill", "function GradientFill(dc : HDC | number, vertices : Array<...>, indices : Array<...>, mode : number) : BOOL", "  \nlowkey this one is weird and complicated see `gdishapes.js`  \nreturns 1 if success");
registerFunc("RoundRect", "function RoundRect(dc : HDC | number, left : number, top : number, right : number, bottom : number, width : number, height : number) : BOOL", "The `RoundRect` function draws a rectangle with rounded corners. The rectangle is outlined by using the current pen and filled by using the current brush.  \nreturns 1 if success");
registerFunc("Ellipse", "function Ellipse(dc : HDC | number, left : number, top : number, right : number, bottom : number) : BOOL", "filled using the current brush and outlined with the current pen  \nreturns 1 if success");
registerFunc("Chord", "function Chord(dc : HDC | number, x1 : number, y1 : number, x2 : number, y2 : number, x3 : number, y3 : number, x4 : number, y4 : number) : BOOL", "The curve of the chord is defined by an ellipse that fits the specified bounding rectangle. The curve begins at the point where the ellipse intersects the first radial and extends counterclockwise to the point where the ellipse intersects the second radial. The chord is closed by drawing a line from the intersection of the first radial and the curve to the intersection of the second radial and the curve.  \nIf the starting point and ending point of the curve are the same, a complete ellipse is drawn.  \nlowkey this one seems complicated af just [read the docs](https://learn.microsoft.com/en-us/windows/win32/api/wingdi/nf-wingdi-chord)  \nreturns 1 if success");
registerFunc("Polyline", "function Polyline(dc : HDC | number, points : Array<...>) : BOOL", "`points` can be an array like this: `[[10, 20], [20, 30]]` or like this: `[{x: 10, y: 20}, {x: 20, y: 30}]`  \nthere must be 2 points or more in the array  \ndrawn using the current pen  \nreturns 1 if success");
registerFunc("PolylineTo", "function PolylineTo(dc : HDC | number, points : Array<...>) : BOOL", "unlike `Polyline` this function uses and updates the current position.  \n`points` can be an array like this: `[[10, 20], [20, 30]]` or like this: `[{x: 10, y: 20}, {x: 20, y: 30}]`  \nim assuming there must be 2 points or more in the array  \ndrawn using the current pen  \nreturns 1 if success");
registerFunc("PolyPolygon", "function PolyPolygon(dc : HDC | number, polygons : Array<...>, points : Array<number>) : BOOL", "`polygons` can be an array like this: `[[10, 20], [20, 30]]` or like this: `[{x: 10, y: 20}, {x: 20, y: 30}]`  \n`points` is array of integers, each of which specifies the number of points in the corresponding polygon. Each integer must be greater than or equal to 2.  \ndrawn using the current pen and filled with the current brush  \nreturns 1 if success");
registerFunc("PolyPolyline", "function PolyPolyline(dc : HDC | number, polylines : Array<...>, points : Array<number>) : BOOL", "The `PolyPolyline` function draws multiple series of connected line segments.  \n`polylines` can be an array like this: `[[10, 20], [20, 30]]` or like this: `[{x: 10, y: 20}, {x: 20, y: 30}]`  \n`points` is an array of variables specifying the number of points in the `polylines` array for the corresponding polyline. Each entry must be greater than or equal to two.  \ndrawn using the current pen and filled with the current brush  \nreturns 1 if success");
registerFunc("Polygon", "function Polygon(dc : HDC | number, points : Array<...>) : BOOL", "`points` can be an array like this: `[[10, 20], [20, 30]]` or like this: `[{x: 10, y: 20}, {x: 20, y: 30}]`  \nthere must be 2 points or more in the array  \ndrawn using the current pen and filled with the current brush  \nreturns 1 if success");
registerFunc("ExtFloodFill", "function ExtFloodFill(dc : HDC | number, x : number, y : number, color : RGB | number, type : number) : BOOL", "fills an area specified with the color of the current brush  \ndepending on what `type` you specify...  \n`FLOODFILLBORDER` is bounded by the `color` you specify while  \n`FLOODFILLSURFACE` fills the `color` you specify with the color of the selected brush  \nreturns 1 if success");
registerFunc("BitBlt", "function BitBlt(hdcDest : HDC | number, x : number, y : number, cx : number, cy : number, hdcSrc : HDC | number, x1 : number, y1 : number, rop : number)", "calls the `window.h` `BitBlt` function  \nthe rop parameter is just flags starting with `SRC...`  \nreturns 0 if failed");
registerFunc("StretchBlt", "function StretchBlt(hdcDest : HDC | number, x : number, y : number, cx : number, cy : number, hdcSrc : HDC | number, x1 : number, y1 : number, cx1 : number, cy1 : number, rop : number)", "calls the `window.h` `StretchBlt` function  \nthe rop parameter is just flags starting with `SRC...`  \nreturns 0 if failed");
registerFunc("MaskBlt", "function MaskBlt(hdcDest : HDC | number, x : number, y : number, cx : number, cy : number, hdcSrc : HDC | number, x1 : number, y1 : number, bmpMask : HBITMAP, maskX : number, maskY : number, rop : number)", "calls the `window.h` `MaskBlt` function  \nthe `bmpMask` must be a monochrome bitmap -> (`CreateBitmap(width, height, 1);`)  \nrop can be made by using `MAKEROP4(foregroundrop : number, backgroundrop : number)`  \nthis function will fail if `bmpMask` is not a monochromic bitmap  \nreturns 0 if failed");
registerFunc("TransparentBlt", "function TransparentBlt(hdcDest : HDC | number, xoriginDest : number, yoriginDest : number, wDest : number, hDest : number, hdcSrc : HDC | number, xoriginSrc : number, yoriginSrc : number, wSrc : number, hSrc : number, crTransparent : number)", "calls the `window.h` `TransparentBlt` function  \nthe `crTransparent` parameter is the color to set as transparent `RGB(...)` color  \nreturns 1 if success");
registerFunc("PatBlt", "function PatBlt(dc : HDC | number, x : number, y : number, width : number, height : number, rop : number) : number", "draws the selected HBRUSH onto the `dc`\nthe HBRUSH must be already selected with `SelectObject()`  \nrop can be any `PAT...` const or `DSTINVERT`,`BLACKNESS`,`WHITENESS`  \nreturns 0 if failed");
registerFunc("PlgBlt", "function PlgBlt(dc : HDC | number, pointArray : POINT[3], hdcSrc : HDC | number, xSrc : number, ySrc : number, width : number, height : number, hbmMask? : HBITMAP | number, xMask? : number, yMask? : number) : number", "the pointArray must be an array like this -> `[{x: 0, y: 0}, {x:100, y: 0}, {x:0,y:300}]` yk yk yk  \nreturns 0 if failed MAYBE");
registerFunc("RotateImage", "function RotateImage(dc : HDC | number, x : number, y : number, width : number, height : number, angle : number, hdcSrc : HDC | number, hbmMask? : HBITMAP | number, xMask? : number, yMask? : number) : number", "yeah im not gonna lie this is really weird idk what's goingo n dont be mad if this one doesn't work lol  \ninternally uses `PlgBlt` to rotate an image  \nangle is in degrees  \nreturns 0 if failed");
registerFunc("AlphaBlend", "function AlphaBlend(hdcDest : HDC | number, xoriginDest : number, yoriginDest : number, wDest : number, hDest : number, hdcSrc : HDC | number, xoriginSrc : number, yoriginSrc : number, wSrc : number, hSrc : number, SourceConstantAlpha : number, AlphaFormat : number)", "calls the `window.h` `AlphaBlend` function  \nthe `SourceConstantAlpha` parameter replaces the native BLENDFUNCTION param. This param can be from 0-255 (with 0 it is assumed that your image is transparent and with 255 it uses per-pixel alpha values)  \n`AlphaFormat` is `AC_SRC_ALPHA` (if `AlphaFormat` is `AC_SRC_ALPHA`, `AlphaBlend` will use per-pixel alpha but will fail if the image/bitmap doesn't have a 32 bit depth/count)  \nreturns 1 if success");
registerFunc("SelectObject", "function SelectObject(dc : HDC | number, object : HGDIOBJ | number) : number", "returns a pointer to the last object selected");
registerFunc("CreatePen", "function CreatePen(style : number, width : number, rgb : RGB | number) : HPEN | number", "the style is any `PS_` constant  \nthe style will automatically be set to PS_SOLID if the width is greater than one (windows controls this, sorry!)  \nif you no long need the pen use `DeleteObject(hPen)`  \nto get information about this object use `GetObjectHPEN(hPen)`  \nreturns a pointer to the newly created `HPEN`");
registerFunc("ExtCreatePen", "function ExtCreatePen(style : number, width : number, lBrush : LOGBRUSH) : HPEN | number", "the style must at least include `PS_GEOMETRIC` or `PS_COSMETIC` or `PS_USERSTYLE` (can be OR'd together with other `PS_` constants like `PS_COSMETIC | PS_SOLID`)  \nlBrush can be retrieved by calling `GetObjectHBRUSH(hBrush)` with an existing HBRUSH  \nif you no longer need the pen use `DeleteObject(hPen)`  \nto get information about this object use `GetObjectExtHPEN(hPen)`  \nreturns a pointer to the newly created `HPEN`  \n(MSDN)[https://learn.microsoft.com/en-us/windows/win32/api/wingdi/nf-wingdi-extcreatepen]");
registerFunc("DeleteObject", "function DeleteObject(object : HGDIOBJ | number) : void", "deletes the `HGDIOBJ` supplied");
registerFunc("DestroyCursor", "function DestroyCursor(object : HCURSOR | number) : void", "don't use if the cursor was created with `LoadCursor/LoadCursorFromFile/LoadImage (with LR_SHARED flag)/CopyImage`  \ndestroys the `HCURSOR` supplied");
registerFunc("DestroyIcon", "function DestroyIcon(object : HICON | number) : void", "don't use if the icon was made with `LoadIcon/LoadImage (with LR_SHARED flag)/CopyImage/CreateIconFromResource`  \ndestroys the `HICON` supplied");
registerFunc("DuplicateIcon", "function DuplicateIcon(hInstance? : HINSTANCE | number, object : HICON | number) : HICON", "im not totally sure the purpose of `hInstance` here so im assuming passing `NULL` is fine  \nduplicates the specified icon and returns the result  \nwhen the icon is no longer needed call `DestroyIcon`");
registerFunc("SetDCPenColor", "function SetDCPenColor(dc : HDC | number, rgb : RGB | number) : void", "sets the color of the selected pen");
registerFunc("SetDCBrushColor", "function SetDCBrushColor(dc : HDC | number, rgb : RGB | number) : void", "sets the color of the selected brush");
registerFunc("GetDCPenColor", "function GetDCPenColor(dc : HDC | number) : RGB", "gets the color of the selected pen");
registerFunc("GetDCBrushColor", "function GetDCBrushColor(dc : HDC | number) : RGB", "gets the color of the selected brush");
registerFunc("GetSysColor", "function GetSysColor(index : number) : RGB", "gets the color of the specified `COLOR`... const");
registerFunc("SetSysColors", "function SetSysColors(elements : number, colorNames : Array<number>, colorValues : Array<COLORREF>) : BOOL", "this function actually changes the system colors for **EVERY window** so if any window is using these colors those shits gone change  \n`elements` is the number of elements in the `colorNames`/`colorValues` arrays  \n`colorNames` is an array of `COLOR_` consts  \n`colorValues` is an array of `RGB(...)` values");
registerFunc("GetTextExtentPoint32", "function GetTextExtentPoint32(dc : HDC | number, text : string) : SIZE | {width, height}", "uses the `text` and currently selected gdi font to determine how big the text drawn would be and returns a SIZE object with width and height keys");
registerFunc("CreateSolidBrush", "function CreateSolidBrush(rgb : RGB | number) : void", "`rgb` can be made with the `RGB` function  \nreturns the pointer to the `HBRUSH`");
registerFunc("MoveTo", "function MoveTo(dc : HDC | number, x : number, y : number) : number", "calls the native `MoveToEx` function for drawing  \nreturns zero if failed");
registerFunc("LineTo", "function LineTo(dc : HDC | number, x : number, y : number) : number", "calls the native `LineTo` function for drawing  \nreturns zero if failed");
registerFunc("Rectangle", "function Rectangle(dc : HDC | number, left : number, top : number, right : number, bottom : number) : number", "calls the native `Rectangle` function for drawing  \nreturns zero if failed");
registerFunc("FillRect", "function FillRect(dc : HDC | number, left : number, top : number, right : number, bottom : number, hBrush : HBRUSH | number) : number", "calls the native gdi `FillRect` function for drawing  \nwhen `hBrush` is NULL, gdi uses the dc's stock brush  \nreturns zero if failed");
registerFunc("GetStockObject", "function GetStockObject(stockObject : number) : HGDIOBJ | number", "calls the native `GetStockObject` function for drawing  \nthe stockObject can be constants ending in brush, pen, or font  \n(`BLACK_BRUSH`, `BLACK_PEN`, `DEVICE_DEFAULT_FONT`, `DEFAULT_PALETTE`)  \nreturns zero if failed");
registerFunc("SetBkColor", "function SetBkColor(dc : HDC | number, rgb : RGB | number) : void", "calls the native `SetBkColor()` which sets the background color for the `TextOut` drawing function");
registerFunc("GetBkColor", "function GetBkColor(dc : HDC | number) : RGB", "calls the native `GetBkColor()` which returns the current background color for the `TextOut` drawing function");
registerFunc("SetBkMode", "function SetBkMode(dc : HDC | number, mode : number) : void", "calls the native `SetBkMode(mode)` which sets the background mode for the `TextOut` drawing functions  \nonly valid args are `OPAQUE` and `TRANSPARENT`  \nreturns the last background mode");
registerFunc("GetBkMode", "function GetBkMode(dc : HDC | number) : number", "calls the native `GetBkMode(dc)` which returns the current background mode for the `TextOut` drawing functions");
registerFunc("GetTextColor", "function GetTextColor(dc : HDC | number) : RGB", "calls the native `GetTextColor()` which gets the text color for the `TextOut` or `DrawText` gdi drawing functions");
registerFunc("SetTextColor", "function SetTextColor(dc : HDC | number, rgb : RGB | number) : RGB", "calls the native `SetTextColor()` which sets the text color for the `TextOut` or `DrawText` gdi drawing functions  \nreturns the previous color");
registerFunc("GetPixel", "function GetPixel(dc : HDC | number, x : number, y : number) : RGB | {r : number, g : number, b : number}", "gets the color of the pixel in the `dc` at the points (`x`,`y`)");
registerFunc("SetPixel", "function SetPixel(dc : HDC | number, RGB : number) : {r : number, g : number, b : number} | number", "sets the color of the pixel in the `dc` at the points (`x`,`y`)  \nreturns the set color or -1 if failed");
registerFunc("SetPixelV", "function SetPixelV(dc : HDC | number, RGB : number) : number", "`SetPixelV` is faster than `SetPixel` because it does not need to return the color value of the point actually painted. (MSDN)  \nreturns 0 if failed");
registerFunc("RGB", "function RGB(r : number, g : number, b : number) : number", "creates a single number for the `r`,`g`,`b` values (r | g << 8 | b << 16)  \nused for GDI functions like `SetDCPenColor` or `SetTextColor` and sometimes `DwmSetWindowAttribute`");
registerFunc("GetRValue", "function GetRValue(color : RGB | number) : number", "gets the r value back from a color created with `RGB`");
registerFunc("GetGValue", "function GetGValue(color : RGB | number) : number", "gets the g value back from a color created with `RGB`");
registerFunc("GetBValue", "function GetBValue(color : RGB | number) : number", "gets the b value back from a color created with `RGB`");
registerFunc("GetStretchBltMode", "function GetStretchBltMode(dc : HDC | number) : number", "returns the stretch mode (which can be `BLACKONWHITE`,`COLORONCOLOR`,`HALFTONE`,`WHITEONBLACK`)");
registerFunc("SetStretchBltMode", "function SetStretchBltMode(dc : HDC | number, mode : number) : number", "sets the stretch mode (which can be `BLACKONWHITE`,`COLORONCOLOR`,`HALFTONE`,`WHITEONBLACK`)  \nreturns 0 if failed");
registerFunc("PrintWindow", "function PrintWindow(hwnd : HWND | number, dc : HDC | number, flags : number) : boolean", "copies a visual window into the specified device context (DC), typically a printer DC. (MSDN)  \ni ain't never seen this function in my life  \nreturns 0 if failed");
registerFunc("CreateBitmap", "function CreateBitmap(width : number, height : number, bitCount? : number, data? : Uint32Array) : HBITMAP | number", "creates an empty bitmap with the specified width and height  \nsetting the bitCount to 1 gives a monochromic bitmap (the default value is 32)  \ndata must be an array made with `new Uint32Array([data])` (because it's fast) OR can be from `GetDIBits` or wicBitmap.`GetPixels()`  \nThe `CreateBitmap` function can be used to create color bitmaps. However, for performance reasons applications should use `CreateBitmap` to create monochrome bitmaps and `CreateCompatibleBitmap` to create color bitmaps.  \nreturns 0 if failed");

registerFunc("FindWindow", "function FindWindow(className? : string, windowTitle : string) : number", "className isn't required and usually is not needed  \nreturns a pointer to the window (`HWND`)");

//registerFunc("GetDesktopWindow", "function GetDesktopWindow(void) : HWND | number", "calls the native `GetDesktopWindow` function and returns the screen's `HWND`");
//registerFunc("GetKeyboardState", "function GetKeyboardState(void) : Array", "calls the native `GetKeyboardState` function and returns an array of length 255");
registerFunc("GetAsyncKeyboardState", "function GetAsyncKeyboardState(void) : Array", "instead of calling `GetKeyboardState` (because it wasn't working) it uses `GetAsyncKeyState` and returns an array of length 255");

registerFunc("GetDefaultFont", "function GetDefaultFont(void) : number", "returns a pointer to the default windows `HFONT` using GetSystemMetrics");

registerFunc("GetKey", "function GetKey(keyCode : number | string[1]) : number", "checks if the keyCode (or letter) is currently being held  \ncalls the native `GetAsyncKeyState(keyCode) & 0x8000`");
registerFunc("GetKeyDown", "function GetKeyDown(keyCode : number | string[1]) : number", "checks if the keyCode (or letter) was just pressed  \ncalls the native `GetAsyncKeyState(keyCode) & 0x1` to tell when the key has just been hit");

registerFunc("PostQuitMessage", "function PostQuitMessage(exitCode : number) : void", "calls the native `PostQuitMessage(exitCode);` to terminate a windows `window`");

registerFunc("GetMousePos", "function GetMousePos(void) : {x: number, y: number}", "alias for `GetCursorPos`  \ncalls the native `GetCursorPos()` and returns the POINT's values");
registerFunc("GetCursorPos", "function GetCursorPos(void) : {x: number, y: number}", "calls the native `GetCursorPos()` and returns the POINT's values");
registerFunc("SetMousePos", "function SetMousePos(x : number, y : number) : void", "alias for `SetCursorPos`  \ncalls the native `SetCursorPos(x, y)` and returns 0 if failed");
registerFunc("SetCursorPos", "function SetCursorPos(x : number, y : number) : void", "calls the native `SetCursorPos(x, y)` and returns 0 if failed");
registerFunc("LoadCursor", "function LoadCursor(hInstance? : number | null, lpCursorName : number) : HCURSOR | number", "lpCursorName can be any `IDC_` const  \nif it isn't working pass hInstance as NULL  \ncalls the native `LoadCursorA(hInstance, lpCursorName)` and returns a pointer to the cursor");
registerFunc("LoadCursorFromFile", "function LoadCursorFromFile(lpCursorName : string) : HCURSOR | number", "lpCursorName must be in the `.CUR` or `.ANI` format  \ncalls the native `LoadCursorFromFile(lpCursorName)` and returns a pointer to the cursor  \nsuperseded by LoadImage(NULL, filelocation, ..., IMAGE_CURSOR, ..., LR_SHARED | LR_LOADFROMFILE)");
registerFunc("LoadImage", "function LoadImage(hInstance? : number | null, name : number | string, type : number, width? : number, height? : number, fuLoad : number) : HANDLE | number", "if it isn't working pass hInstance as NULL  \nTHE BITMAP MUST HAVE A `BIT DEPTH <= 24` check the file properties of your bitmap and go to details to find bit depth  \ncalls the native `LoadImageW(hInstance, name, type, width, height, fuLoad)` and returns a pointer to the cursor  \ntype can be any `IMAGE_` const  \nfuLoad can be any `LR_` const (can be OR'd together)  \nif width or height are 0 and you don't use the `LR_DEFAULTSIZE` flag then it will use the icon's actual width/height  \nreturns 0 if failed");
registerFunc("CopyImage", "function CopyImage(handle : HANDLE | number, type : number, newWidth? : number, newHeight? : number, flags : number) : HANDLE | number", "`handle` is the image to be copied  \n`type` can be any `IMAGE_`... const  \nif newWidth or/and newHeight are 0 the returned image will be the same width and/or height as the original  \nthe image is stretch to fit the new width and height  \n`flags` can be (SOME)[https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-copyimage] `LR_`... consts  \nbased on what type of image you copied use its respective `Destroy`... function (if you copied a bitmap use `DeleteObject`, if you used a cursor/icon use `DestroyCursor`/`DestroyIcon`)");
registerFunc("MAKEINTRESOURCE", "function MAKEINTRESOURCE(i : number)", "uses the native `MAKEINTRESOURCEA(i)` macro");// for use with `LoadCursor`");
registerFunc("SetCursor", "function SetCursor(cursor : HCURSOR | number) : HCURSOR | number", "calls the native `SetCursor(cursor)` function and if cursor is NULL the cursor is removed  \nreturns the last cursor or 0 if failed`");
registerFunc("DrawIconEx", "function DrawIconEx(dc : HDC | number, xLeft : number, yTop : number, hIcon : HICON | number, cxWidth? : number, cyWidth? : number, istepIfAniCur? : number, hbrFlickerFreeDraw? : HBRUSH | number, diFlags? : number) : number", "calls the native `DrawIconEx(...)` function  \ndiFlags can be any `DI_` const (can be OR'd together `|` )  \nreturns 0 if failed`");
registerFunc("DrawIcon", "function DrawIcon(dc : HDC | number, xLeft : number, yTop : number, hIcon : HICON | number) : number", "calls the native `DrawIcon(...)` function  \nreturns 0 if failed`");
registerFunc("LoadIcon", "function LoadIcon(hInstance : HINSTANCE | number, lpIconName : number) : HICON | number", "if it isn't working pass hInstance as NULL  \ncalls the native `LoadIconA(hInstance, lpIconName)` function");
registerFunc("HICONFromHBITMAP", "function HICONFromHBITMAP(bitmap : HBITMAP | number) : HICON | number", "some random function i found on the interwebs lets see if it works  \nuses CreateIconIndirect to create an icon with the bitmap");
registerFunc("ExtractAssociatedIcon", "function ExtractAssociatedIcon(hInstance : HINSTANCE | number, path : string) : {icon : HICON, id : number}", "loads an icon from the file specified with `path` (for example it can be an .exe file)  \nreturns an object with properties `icon` (which is the actual HICON) and `id` (which idk really know what it means)  \nwhen the icon is no longer needed call `DestroyIcon` to free the handle");

registerFunc("createCanvas", "function createCanvas(context : string, type : number, window? : HWND | number, wic? : WIC) : object<type>", "valid args are `d2d`/`direct2d` and `ID2D1RenderTarget`/`ID2D1DCRenderTarget`/`ID2D1DeviceContext`/`ID2D1DeviceContextDComposition`  \n`direct3d`/`d3d` not yet implemented  the `wic` parameter must be an object returned from `InitializeWIC()` and with it you are allowed to call `d2d.CreateBitmapFromFilename`  \n**WHEN USING `ID2D1DeviceContextDComposition` YOU MUST SPECIFY THE `WS_EX_NOREDIRECTIONBITMAP` EXTENDED FLAG FOR YOUR WINDOW!!!**\n  \nreturns an object for the specified type");

registerFunc("Sleep", "function Sleep(ms : number) : void", "calls the native `Sleep(ms)` function to pause the current thread for x milliseconds");

registerFunc("GetClientRect", "function GetClientRect(hwnd : HWND | number) : RECT | {left : number, top : number, right : number, bottom : number}", "calls the native `GetClientRect()` function and returns a `RECT` object with the properties  \n`left`,`top`,`right`,`bottom`");
registerFunc("GetWindowRect", "function GetWindowRect(hwnd : HWND | number) : RECT | {left : number, top : number, right : number, bottom : number}", "calls the native `GetWindowRect()` function and returns a `RECT` object with the properties  \n`left`,`top`,`right`,`bottom`");

registerFunc("GetConsoleWindow", "function GetConsoleWindow(void) : number", "returns a pointer to the console window (`HCONSOLE`)");

registerFunc("DestroyWindow", "function DestroyWindow(hwnd : HWND | number) : void", "calls the native `DestroyWindow` function on the HWND");
//#endregion
registerFunc("GET_X_LPARAM", "function GET_X_LPARAM(lp : LPARAM | number) : number", "use with the `WM_` mouse events to get the x position of the mouse");
registerFunc("GET_Y_LPARAM", "function GET_Y_LPARAM(lp : LPARAM | number) : number", "use with the `WM_` mouse events to get the y position of the mouse");
registerFunc("HIWORD", "function HIWORD(dword : DWORD | number) : number", "Retrieves the high-order word (two bytes) from the specified 32-bit value.  \n`<---------------DWORD--------------->`  \n`[00000000:00000000:00000000:00000000]`  \n`<-----HIWORD-----><------LOWORD----->`");//"Retrieves the high-order word from the specified 32-bit value.");
registerFunc("LOWORD", "function LOWORD(dword : DWORD | number) : number", "Retrieves the low-order word (two bytes) from the specified 32-bit value.  \n`<---------------DWORD--------------->`  \n`[00000000:00000000:00000000:00000000]`  \n`<-----HIWORD-----><------LOWORD----->`");
//https://www.gamedev.net/forums/topic/17208-wanna-explain-loword-hiword-dword/#:~:text=LOWORD%20gets%20the%20lower%2016,another%20piece%20in%20the%20hiword.
registerFunc("GetWindowText", "function GetWindowText(hwnd : HWND | number) : string", "gets the window title/text of the HWND");
registerFunc("SetScrollInfo", "function SetScrollInfo(hwnd : HWND | number, nBar : number, scrollInfo : ScrollInfo, redraw : boolean) : number", "nBar is any `SB_`... const  \nreturns the new position of the scroll bar");
registerFunc("GetScrollInfo", "function GetScrollInfo(hwnd : HWND | number, nBar : number) : ScrollInfo", "nBar is any `SB_`... const");
registerFunc("GetScrollRange", "function GetScrollRange(hwnd : HWND | number, nBar : number) : {min : number, max : number}", "nBar is any `SB_`... const");

registerFunc("SetWindowText", "function SetWindowText(hwnd : HWND | number, text : string) : boolean", "sets the window title/text of the HWND  \nreturns 0 if failed");
registerFunc("SetWindowPos", "function SetWindowPos(hwnd : HWND | number, hwndInsertAfter : HWND | number, x : number, y : number, cx : number, cy : number, uFlags : number) : number", "hwndInsertAfter is any `HWND_` const  \nvalid flags are any `SWP_` const (can be OR'd together)  \nreturns 0 if failed");
registerFunc("GetForegroundWindow", "function GetForegroundWindow(void) : HWND | number", "gets the foreground window (the window you are literally looking at)");
registerFunc("SetForegroundWindow", "function SetForegroundWindow(hwnd : HWND | number) : number", "sets the foreground window with the supplied `HWND`  \nreturns 0 if failed i think");
registerFunc("GetActiveWindow", "function GetActiveWindow(void) : HWND | number", "slightly different than the foreground window and doesn't seem do anything");
registerFunc("SetActiveWindow", "function SetActiveWindow(hwnd : HWND | number) : HWND | number", "sets the active window (usually for text input windows i think)  \nreturns 0 if failed i think");

registerFunc("SetLayeredWindowAttributes", "function SetLayeredWindowAttributes(hwnd : HWND | number, transparencyColor : RGB | number, alpha : number, dwFlags : number) : number", "`transparencyColor` is an `RGB()` value  \nalpha is 0-255  \ndwFlags can be any `LWA_` const [(wtf the flags can be OR'd together???)](https://stackoverflow.com/questions/43712796/draw-semitransparently-in-invisible-layered-window)  \nreturns 0 if failed");
registerFunc("GetLayeredWindowAttributes", "function GetLayeredWindowAttributes(hwnd : HWND | number) : {transparencyColor : number, alpha : number, dwFlags : number}", "returns an object with properties about this thing ykyk");
registerFunc("UpdateLayeredWindow", "function UpdateLayeredWindow(hwnd : HWND | number, hdcDst : HDC | number, newPosition? : POINT, newSize? : SIZE, hdcSrc? : HDC | number, location? : POINT, crKey : RGB | number, SourceConstantAlpha? : number, AlphaFormat? : number, dwFlags : number) : number", "if `hdcSrc` is NULL, hdcDst must be NULL  \nif the current position is not changing, `newPosition` can be NULL  \nif the size of the window is not changing `newSize` can be NULL  \nIf the shape and visual context of the window are not changing, `hdcSrc` can be **NULL**  \nif `hdcSrc` is NULL `location` should be NULL  \ncrKey is an integer created with `RGB(r,g,b)`  \n`AlphaFormat` can be `AC_SRC_ALPHA`  \n[`SourceConstantAlpha` and `AlphaFormat`](https://learn.microsoft.com/en-us/windows/win32/api/wingdi/ns-wingdi-blendfunction) can be NULL if dwFlags = `ULW_COLORKEY`  \nreturns 0 if failed  \n[MSDN](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatelayeredwindow)");

registerFunc("WindowFromDC", "function WindowFromDC(dc : HDC | number) : HWND | number", "i mean this function explains itself");
registerFunc("WindowFromPoint", "function WindowFromPoint(x : number, y : number) : HWND | number", "yeah this function does that");

registerFunc("EnumWindows", "function EnumWindows(func : Function(hwnd : HWND | number)) : void", "takes a function with 1 parameter  \nloops through all the windows running on your computer");

registerFunc("keybd_event", "function keybd_event(keyCode : number : string, flags : number) : void", "the `keyCode` can be any char or `VK_` const  \nthe flags can be any `KEYEVENTF_` const but normally is just `KEYEVENTF_EXTENDEDKEY` or/and `KEYEVENTF_KEYUP` flags can be OR'd together");
registerFunc("mouse_event", "function mouse_event(dwFlags : number, dx : number, dy : number, dwData : number) : void", "the `dwFlags` can be any `MOUSEEVENTF` const  \nfor wheel events the dwData can be the amount to scroll");
registerFunc("SendInput", "function SendInput(...inputs : {type : number, wVk : number, dwFlags : number}) : void", "successor to the `keybd_event` and `mouse_event` functions  \ntakes any amount of objects that have a `type`, `wVk`, and `dwFlags` property");
registerFunc("MakeKeyboardInput", "function MakeKeyboardInput(keyCode : string | number, keyUp : boolean) : {type : number, wVk : number, dwFlags : number}", "helper function for use with `SendInput`  \nused to include the time property but it actually doesn't do anything");
registerFunc("MakeMouseInput", "function MakeMouseInput(x : number, y : number, mouseData : number | undefined, dwFlags : number) : {type : number, dx : number, dy : number, mouseData : number, dwFlags : number}", "helper function for use with `SendInput`  \nif dwFlags is MOUSEEVENTF_WHEEL then mousedata should be the amount you scroll  \ndwFlags (any `MOUSEEVENTF_` const) can be OR'd together  \nthe `dx` and `dy` params do not have to be 0-65535 because I do the math for you");//  \nWARNING: if you use `MOUSEEVENTF_ABSOLUTE` the `dx` and `dy` parameters have to be between 0-65535 for some reason so the math is `65535/(screenwidth/x)` and `65535/(screenheight/y)`"); //https://www.desmos.com/calculator/ndgevnyews

registerFunc("GetLastError", "function GetLastError(void) : number", "calls the native `GetLastError()` function  \nreturns the last error code`");

registerFunc("GetStdHandle", "function GetStdHandle(stdHandle : number) : HANDLE | number", "stdHandle can be any `STD_`... const  \nuse `STD_OUTPUT_HANDLE` to get the console's handle (for use with functions like `SetConsoleTextAttribute`)");
registerFunc("SetConsoleTextAttribute", "function SetConsoleTextAttribute(console : HANDLE | number, attributes : number) : BOOL", "  \nreturns true if success");

registerFunc("IsIconic", "function IsIconic(hwnd : HWND | number) : boolean", "checks if the window is minimized");
registerFunc("IsWindowVisible", "function IsWindowVisible(hwnd : HWND | number) : boolean", "checks if the window is visible");
registerFunc("IsChild", "function IsChild(hwndParent : HWND | number, hwnd : HWND | number) : boolean", "checks if `hwnd` is the child of `hwndParent`");
registerFunc("SetParent", "function SetParent(hwndChild : HWND | number, hwndNewParent : HWND | number) : boolean", "sets the parent of `hwndChild`");
registerFunc("GetParent", "function GetParent(hwnd : HWND | number) : HWND", "returns the parent's `HWND`");
registerFunc("SendMessage", "function SendMessage(hwnd : HWND | number, msg : number, wp : number, lp : number) : LRESULT | number", "sends the `msg` to the `hwnd`  \na message can be alot of consts so google it (normal ones being `WM_`...)");
registerFunc("SendMessageStr", "function SendMessageStr(hwnd : HWND | number, msg : number, wp : number) : wstring", "sends the `msg` to the `hwnd`  \na message can be alot of consts so google it (normal ones being `WM_`...)  \nif the `msg` is something special like `CB_GETLBTEXT` where the LPARAM is used to get the string within use this function");
registerFunc("SetClassLongPtr", "function SetClassLongPtr(hwnd : HWND | number, nIndex : number, dwNewLong : number) : number", "can be used to change window icons AMONG other thangs (look it up)  \n`nIndex` is any `GCL_` or `GCLP_` const  \nreturns the previous value (can be 0) or 0 if failed");
registerFunc("SetWindowLongPtr", "function SetWindowLongPtr(hwnd : HWND | number, nIndex : number, dwNewLong : number) : number", "can set some data in a window  \n`nIndex` is any `GWLP_` or `DWLP_` or `GWL_` const (if hwnd is a dialogbox)  \nreturns the previous value (can be 0) or 0 if failed");
registerFunc("GetClassLongPtr", "function GetClassLongPtr(hwnd : HWND | number, nIndex : number) : number", "can be used to get a window's icon AMONG other thangs (look it up)  \n`nIndex` is any `GCL_` or `GCLP_` const");
registerFunc("GetWindowLongPtr", "function GetWindowLongPtr(hwnd : HWND | number, nIndex : number) : number", "can get some data from a window (like its `HINSTANCE` with `GWLP_HINSTANCE`)  \n`nIndex` is any `GWL_`, `GWLP_`, or `DWLP_` const (if hwnd is a dialogbox)");

registerFunc("GetIconDimensions", "function GetIconDimensions(hIcon : HICON | number) : {width : number, height : number}", "msn example function on how to get the size from an HICON lol  \nreturns an object with `width` and `height` properties"); //\nreturns an object with `cx` and `cy` properties");
registerFunc("GetBitmapDimensions", "function GetBitmapDimensions(hBitmap : HBITMAP | number) : {width : number, height : number}", "helper function to get the size of a loaded bitmap  \nyou don't have to use this anymore because `GetObjectHBITMAP(hBitmap).bmWidth/bmHeight` is now a thing  \nreturns an object with `width` and `height` properties");
//registerFunc("GetBitmapDimensionEx", "function GetBitmapDimensionEx(hBitmap : HBITMAP | number) : number | {width : number, height : number}", "`hBitmap` can be a bitmap obtained from `LoadImage`  \nreturns the bitmap's size if success otherwise 0"); //lowkey still implemented but they don't really work
//registerFunc("SetBitmapDimensionEx", "function SetBitmapDimensionEx(hBitmap : HBITMAP | number, newWidth : number, newHeight : number) : number | {width : number, height : number}", "`hBitmap` can be a bitmap obtained from `LoadImage` BUT it cannot be a DIB section bitmap or else this shit will fail  \nreturns the previous size if success otherwise 0");

registerFunc("SetCapture", "function SetCapture(hwnd : HWND | number) : HWND | number", "sets the mouse capture to the `hwnd`  \nallows your window to still get mouse events even if you aren't hovering over the window  \nreturns the last window that had the mouse or 0");
registerFunc("ReleaseCapture", "function ReleaseCapture() : boolean", "releases the mouse capture from a window  \nreturns 0 if failed");
registerFunc("ClipCursor", "function ClipCursor(left : number, top : number, right : number, bottom : number) : boolean", "restricts the mouse to the supplied rect  \nreturns 0 if failed");

registerFunc("MAKEPOINTS", "function MAKEPOINTS(lParam : LPARAM : number) : {x : number, y : number}", "takes an lparam and converts it to an object with `x` and `y` properties  \nuses the native MAKEPOINTS macro");
registerFunc("GET_WHEEL_DELTA_WPARAM", "function GET_WHEEL_DELTA_WPARAM(wp : WPARAM) : number", "used with the WM_MOUSEWHEEL event to get the distance the mouse wheel was scrolled");

registerFunc("GetSystemMetrics", "function GetSystemMetrics(metric : number) : number", "the metric parameter can be any `SM_`... const");

registerFunc("_com_error", "function _com_error(HRESULT : number) : string", "used for helping with errors for objects (like `createCanvas(\"direct2d\")` or `createCanvas(\"direct3d\")`)  \nalso apparently can be used like `_com_error(GetLastError())` to get the error in text (which i didn't know worked with get last error)");

registerFunc("Beep", "function Beep(frequency : number, durationMs : number, nonblocking? : boolean) : number", "plays a sound on your onboard speaker (if you have one) OR plays a sound through your headphones/realtek yk yk yk  \nalso this blocks the thread for `durationMs` unless specified");
registerFunc("MessageBeep", "function MessageBeep(type : number) : BOOL", "the `type` can be most `MB_`... consts  e.g. `MB_OK` or `MB_ICONERROR`  \nplays a sound on your onboard speaker (if you have one) OR plays a sound through your headphones/realtek yk yk yk  \nreturns 1 if success");

registerFunc("GetObjectHBITMAP",  "function GetObjectHBITMAP(hBitmap : HBITMAP | number) : BITMAP", "returns an object with properties relating to `hBitmap` like its width or height  \nthe bmBits property will be NULL (0) unless `hBitmap` was created with `CreateDIBSection` OR `LoadImage(,,,,,LR_CREATEDIBSECTION)` (and i just found this out)[https://stackoverflow.com/questions/12832292/why-does-getobject-return-an-bitmap-with-null-bmbits]");
registerFunc("CreateBitmapIndirect", "function CreateBitmapIndirect(logBitmap : BITMAP) : HBITMAP | number", "`logBitmap` can be an object made by `GetObjectHBITMAP`  \nuse `DeleteObject` to delete this bitmap when not needed anymore");

registerFunc("GetObjectDIBITMAP", "function GetObjectDIBITMAP(hBitmap : HBITMAP | number) : DIBSECTION", "`hBitmap` must be a bitmap created with `CreateDIBSection`  \nreturns a large object (so large in fact my extension can't handle that rn so you have to `print` to see its properties)");

registerFunc("GetObjectHPALETTE", "function GetObjectHPALETTE(hPalette : HPALLETE) : number", "returns the number of color entries in said palette");

registerFunc("GetObjectExtHPEN",  "function GetObjectExtHPEN(hPen : HPEN | number) : EXTLOGPEN", "`hPen` must be an object created with `ExtCreatePen`  \nreturns an object with details about the pen like its width and color");
registerFunc("GetObjectHPEN",     "function GetObjectHPEN(hPen : HPEN | number) : LOGPEN", "returns an object with details about this pen like its style, width, and color");
registerFunc("CreatePenIndirect", "function CreatePenIndirect(logPen : LOGPEN) : HPEN | number", "`logPen` can be an object created with `GetObjectHPEN` idk about `GetObjectExtHPEN` though  \nuse `DeleteObject` to delete this pen when not needed anymore");

registerFunc("GetObjectHBRUSH",   "function GetObjectHBRUSH(hBrush : HBRUSH | number) : LOGBRUSH", "returns an object with details about this brush like its style, color, and hatch");
registerFunc("CreateBrushIndirect","function CreateBrushIndirect(logBrush : LOGBRUSH) : HBRUSH | number", "`logBrush` can be an object returned from `GetObjectHBRUSH`  \nuse `DeleteObject` to delete this brush when not needed anymore");

registerFunc("GetObjectHFONT",    "function GetObjectHFONT(hFont : HFONT | number) : LOGFONT", "returns an object with details about this font like its `lfFaceName` or `lfHeight` and `lfWidth`");
registerFunc("CreateFontIndirect", "function CreateFontIndirect(logFont : LOGFONT) : HFONT | number", "logFont is an object with the `LOGFONT`'s properties (find it on microsoft docs)  \nreturns an HFONT or 0 if failed probably");

registerFunc("GetObjectHICON", "function GetObjectHICON(hIcon : HICON | number) : ICONINFO", "returns an object with information about the icon including a pointer to the bitmap  \ninternally uses `GetIconInfo` because for some reason you can't get it with `GetObject`");
registerFunc("GetIconInfo", "function GetIconInfo(hIcon : HICON | number) : ICONINFO", "returns an object with information about the icon including a pointer to the bitmap");
registerFunc("CreateIconIndirect", "function CreateIconIndirect(ii : ICONINFO) : number", "change fIcon to true for an alpha icon  \n(in place of an `HCURSOR` you can use an `HICON`)[https://learn.microsoft.com/en-us/windows/win32/menurc/using-cursors#creating-a-cursor]  \nreturns 0 if failed probably");
//kinda funny to think about how all these functions are related to peter.js
registerFunc("PlaySound", "function PlaySound(sound : string, hInstance? : number, soundFlags : number) : number", "if using `SND_FILENAME` then `sound` must be the path to a .WAV file **use `PlaySoundSpecial` to play mp3**  \nset `hInstance` to null or undefined unless you are using the flag `SND_RESOURCE`  \nsoundFlags can be any `SND_` const (can be OR'd together) SND_SYNC by default is already applied  \nreturns 0 if failed i think");
registerFunc("PlaySoundSpecial", "function PlaySoundSpecial(soundFileName : string, soundId? : string, hwnd? : HWND | number, sync? : boolean) : number", "soundFileName is a path to the file  \nsoundId a name of the sound for use with `StopSoundSpecial(soundId)`  \ninternally uses windows.h `mciSendString`  \nthe optional `hwnd` should recieve the `MM_MCINOTIFY` event when the sound is done playing (lowkey not working)  \nreturns 0 if success for some reason"); //https://stackoverflow.com/questions/22253074/how-to-play-or-open-mp3-or-wav-sound-file-in-c-program
registerFunc("StopSoundSpecial", "function StopSoundSpecial(soundId : string) : number", "stops and closes the currently playing sound by its `soundId`  \ninternally uses windows.h `mciSendString`  \nreturns 0 if success for some reason");
registerFunc("InitiateSystemShutdown", "function InitiateSystemShutdown(machineName? : string, message : string, timeout : number, forceAppsClosed : boolean, rebootAfterShutdown : boolean, reason : number) : number", "obviously probably don't use this  \nif (for some reason) this doesn't work you can always use `system(\"shutdown -s -t 0\")`  \nmachineName is `localhost` to shutdown the computer  \nreturns 0 if failed");
registerFunc("AbortSystemShutdown", "function AbortSystemShutdown(machineName? : string) : number", "if machineName is null then it aborts the shutdown of the local computer  \nobviously i felt obligated to add this one  \nreturns 0 if failed and if it does, godspeed **o7**");

registerFunc("CreateDIBSection", "function CreateDIBSection(dc : HDC | number, dibBitmap : BITMAP, usageFlags : number) : Object", "`dibBitmap` must be a BITMAP object created with `GetObjectDIBITMAP` or `CreateDIBitmapSimple`  \nusageFlags can be any `DIB_` const  \nreturns an object with properties for editing the bitmap, to actually get the bitmap use `.bitmap`");
registerFunc("CreateDIBitmapSimple", "function CreateDIBitmapSimple(biWidth : number, biHeight : number, biBitCount : number, biPlanes : number, biSizeImage : number) : Object", "`biBitCount`, `biPlanes`, and `biSizeImage` are all optional  \nbiSizeImage can be 0 for uncompressed RGB bitmaps  \nreturns an object for use with `CreateDIBSection`");
registerFunc("GetDIBits", "function GetDIBits(dc : HDC | number, hBmp : HBITMAP | number, start : number, scanLines : number, width : number, height : number, bitCount : number, compression : number) : Uint32Array", "for some reason `hBmp` must be a compatible bitmap (DDB)  \nscanLines can just be the height of the bitmap  \ncompression can be any `BI_` const  \nthrows an error if failed");
registerFunc("SetDIBits", "function SetDIBits(dc : HDC | number, compatibleBmp : HBITMAP | number, start : number, scanLines : number, bits : Uint32Array | ArrayBufferView | DIBSection | number, DIBinfo : DIBITMAP, usage : number)", "`compatibleBmp` must be an HBITMAP created with `CreateCompatibleBitmap`  \n`start` can just be 0  \n`scanLines` is the height  \n`bits` can be a DIBSection (like one created by `CreateDIBSection`), or any UintArray (or if you have one, a pointer to some data)  \nif `bits` is a DIBSection then you can omit `DIBinfo` and `usage`  \n`DIBinfo` is an object created with `CreateDIBitmapSimple`  \n`usage` is one of the `DIB_`... consts (usually `DIB_RGB_COLORS`)  \nThe device context identified by the `dc` parameter is used only if the `DIB_PAL_COLORS` constant is set for the `usage` parameter; otherwise it is ignored.  \nThe bitmap identified by the `compatibleBmp` parameter must not be selected into a device context when the application calls this function.");

registerFunc("SetBitmapBits", "function SetBitmapBits(compatiblehbm : HBITMAP | number, byteLength : number, bits : Uint32Array | ArrayBufferView | DIBSection | number) : number", "`compatiblehbm` gotta be a compatible bitmap (DDB).  \n`bits` can be a DIBSection (like one created by `CreateDIBSection`), or any UintArray (or if you have one, a pointer to some data)  \nif success this function returns the number of bytes used in setting the bitmap bits. (if not it returns 0)  \nthis function probably still works but MSDN says: This function is provided only for compatibility with 16-bit versions of Windows. Applications should use the `SetDIBits` function.");

registerFunc("SetTimer", "function SetTimer(hwnd : HWND | number, timerId? : number, timeMs : number) : number", "sends the `hwnd` a WM_TIMER message every `timeMs` milliseconds  \nif timerId is 0 it will choose a random id and return it  \nreturns the id of the newly created timer");
registerFunc("KillTimer", "function KillTimer(hwnd : HWND | number, timerId : number) : number", "stops the `hwnd`'s timer by its id  \nreturns 0 if failed");

registerFunc("GetGraphicsMode", "function GetGraphicsMode(dc : HDC | number) : number", "returns this device context's graphics mode  \nthe only values can be `GM_COMPATIBLE` or `GM_ADVANCED`");
registerFunc("SetGraphicsMode", "function SetGraphicsMode(dc : HDC | number, mode : number) : number", "`mode` can only be `GM_COMPATIBLE` or `GM_ADVANCED`  \n`GM_LAST` is equal to `GM_ADVANCED`  \ndefault mode is GM_COMPATIBLE  \nreturns the old graphics mode");
registerFunc("GetMapMode", "function GetMapMode(dc : HDC | number) : number", "returns this device context's map mode (any `MM_` const)");
registerFunc("SetMapMode", "function SetMapMode(dc : HDC | number, mode : number) : number", "`mode` can be any `MM_` const");
registerFunc("GetWorldTransform", "function GetWorldTransform(dc : HDC | number) : XFORM", "returns an object with properties dawg just look at em");
registerFunc("SetWorldTransform", "function SetWorldTransform(dc : HDC | number, transform : XFORM) : number", "in order to use this function you must use `SetGraphicsMode(GM_ADVANCED)` before it  \ntransform must be an object like one returned from `GetWorldTransform`  \nreturns 0 if failed");
registerFunc("ModifyWorldTransform", "function ModifyWorldTransform(dc : HDC | number, transform? : XFORM | null, mode : number) : number", "in order to use this function you must use `SetGraphicsMode(GM_ADVANCED)` before it  \nmode can be any `MWT_` const (if it is `MWT_IDENTITY` then transform can be NULL and will be ignored)  \nif transform is nonnull it must be an object like one returned from `GetWorldTransform`  \nreturns 0 if failed");
//yeahigottacheckifitworksonchildwindows (it does :sunglasses:)
registerFunc("AnimateWindow", "function AnimateWindow(hwnd : HWND | number, timeMs : number, flags : number)", "flags can be any `AW_` const  \nunfortunately it only animates child windows :(  \nalso apparently this blocks the thread?");

registerFunc("GetWindowExtEx", "function GetWindowExtEx(dc : HDC | number) : {width : number, height : number}", "This function retrieves the x-extent and y-extent of the window for the specified device context.  \nreturns the current horizontal and vertical extents");
registerFunc("SetWindowExtEx", "function SetWindowExtEx(dc : HDC | number, x : number, y : number) : {width : number, height : number}", "The `SetWindowExtEx` function sets the horizontal and vertical extents of the window for a device context by using the specified values.  \nreturns the previous horizontal and vertical extents");
registerFunc("GetViewportExtEx", "function GetViewportExtEx(dc : HDC | number) : {width : number, height : number}", "The `GetViewportExtEx` function retrieves the x-extent and y-extent of the current viewport for the specified device context.  \nreturns the current horizontal and vertical extents");
registerFunc("SetViewportExtEx", "function SetViewportExtEx(dc : HDC | number, x : number, y : number) : {width : number, height : number}", "The `SetViewportExtEx` function sets the horizontal and vertical extents of the viewport for a device context by using the specified values.  \nreturns the previous horizontal and vertical extents");

//barely any notes on these because i barely know waht they do im just following guide because i want it to work lol
registerFunc("SetWindowCompositionAttribute", "function SetWindowCompositionAttribute(hwnd : HWND | number, AccentState : number, Flags : number, GradientColor : number, AnimationId : number) : bool", "AccentState can be any `ACCENT_` const  \nidk about any other parameters but im gonna assume that MAYBE `GradientColor` is an `RGB`'ed value  \nreturns true if success (probably)");
registerFunc("DwmExtendFrameIntoClientArea", "function DwmExtendFrameIntoClientArea(hwnd : HWND | number, left : number, top : number, right : number, bottom : number) : number", "if `left`,`top`,`right`, and `bottom` are -1 then [something special happens](https://learn.microsoft.com/en-us/windows/win32/api/dwmapi/nf-dwmapi-dwmextendframeintoclientarea?redirectedfrom=MSDN#examples)  \nreturns 0 if success");
registerFunc("DwmEnableBlurBehindWindow", "function DwmEnableBlurBehindWindow(hwnd : HWND | number, enable : boolean, dwFlags : number, left? : number, top? : number, right? : number, bottom? : number) : HRESULT", "returns 0 if success");
registerFunc("DwmDefWindowProc", "function DwmDefWindowProc(hwnd : HWND | number, msg : number, wp : number, lp : number) : boolean", "uhhh im using [this example](https://learn.microsoft.com/en-us/windows/win32/dwm/blur-ovw) check my `customwindowframe.js`  \nreturns 1 if dwm handled the message");
registerFunc("DwmSetWindowAttribute", "function DwmSetWindowAttribute(hwnd : HWND | number, dwAttribute : DWMWINDOWATTRIBUTE | number, pvAttribute : any) : HRESULT", "`dwAttribute` can be any `DWMWA_` const  \n`pvAttribute` is the value associated with dwAttribute ([more info here](https://learn.microsoft.com/en-us/windows/win32/api/dwmapi/ne-dwmapi-dwmwindowattribute))  \nreturns 0 if succeeded");
registerFunc("DwmGetWindowAttribute", "function DwmGetWindowAttribute(hwnd : HWND | number, dwAttribute : DWMWINDOWATTRIBUTE | number) : any", "`dwAttribute` can be any `DWMWA_` const  \nreturns the value associated with dwAttribute ([more info here](https://learn.microsoft.com/en-us/windows/win32/api/dwmapi/ne-dwmapi-dwmwindowattribute))  \nerrors if failed");
registerFunc("DwmSetIconicThumbnail", "function DwmSetIconicThumbnail(hwnd : HWND | number, hBmp : HBITMAP | number, dwSITFlags : number) : HRESULT | number", "`hBmp` must be a bitmap created with `CreateDIBSection` for some reason (see `newdwmfuncs.js`)  \n`dwSITFlags` can either be 0 (for no frame to be displayed around the thumbnail) or 1  \nusually used with the `WM_DWMSENDICONICTHUMBNAIL` message apparently  \nreturns 0 if success");
registerFunc("DwmSetIconicLivePreviewBitmap", "function DwmSetIconicLivePreviewBitmap(hwnd : HWND | number, hBmp : HBITMAP | number, pClientOffset : POINT | array, dwSITFlags : number) : HRESULT | number", "`hBmp` must be a bitmap created with `CreateDIBSection` for some reason (see `newdwmfuncs.js`)  \n`dwSITFlags` can either be 0 (for no frame to be displayed around the thumbnail) or 1  \nreturns 0 if success");
registerFunc("DwmInvalidateIconicBitmaps", "function DwmInvalidateIconicBitmaps(hwnd : HWND | number) : HRESULT | number", "tells DWM to update iconic bitmaps  \nreturns 0 if success");
//registerFunc("NCCALCSIZE_PARAMS", "function NCCALCSIZE_PARAMS(lParam : LPARAM | number) : Object", "returns an object... for use with WM_NCCALCSIZE");
registerFunc("SetWindowDisplayAffinity", "function SetWindowDisplayAffinity(hwnd : HWND | number, affinityFlags : number) : boolean", "apparently Specifies where the content of the window can be displayed.  \naffinityFlags can be any `WDA_` const  \nreturns true if success (if not use `GetLastError`)");
registerFunc("GetWindowDisplayAffinity", "function GetWindowDisplayAffinity(hwnd : HWND | number) : number", "if success returns a `WDA_` const, if not returns garbage or something");
registerFunc("DefWindowProc", "function DefWindowProc(hwnd : HWND | number, msg : number, wp : WPARAM | number, lp : LPARAM | number) : LRESULT", "calls the default window proc");


registerFunc("SwitchToThisWindow", "function SwitchToThisWindow(hwnd : HWND | number, fUnknown : boolean) : void", "A TRUE value for fUknown indicates that the window is being switched to using the Alt/Ctl+Tab key sequence. ([MSDN](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-switchtothiswindow))");
registerFunc("showOpenFilePicker", "function showOpenFilePicker(options : Object) : String", "details about the options parameter can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker#examples) BUT check `showOpenFilePicker.js` for example usage (**the options are slightly different**)  \nreturns a list of the file(s) picked");
registerFunc("showSaveFilePicker", "function showSaveFilePicker(options : Object) : String", "details about the options parameter can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker#examples) (options are the same as `showOpenFilePicker`)  \nreturns the path of the file picked (can't do multiple)");
registerFunc("showDirectoryPicker", "function showDirectoryPicker(void) : String", "no options on this one because i lowkey can't be bothered to implement them (they're not that hard to put in but i don't think they're that important to include them)  \nreturns the path of the folder picked (can't do multiple)");

registerFunc("DragAcceptFiles", "function DragAcceptFiles(hwnd : HWND | number, accept : boolean) : void", "Registers whether a window accepts dropped files.  \nthis is the same as passing the `WS_EX_ACCEPTFILES` extended window flag");
registerFunc("DragQueryPoint", "function DragQueryPoint(hDrop : HDROP) : POINT | {x, y}", "Retrieves the position of the mouse pointer at the time a file was dropped during a drag-and-drop operation.  \nthe `WM_DROPFILES` window message sends an `HDROP` as the `WPARAM`");
registerFunc("DragQueryFile", "function DragQueryFile(hDrop : HDROP, iFile : number) : ", "Retrieves the names of dropped files that result from a successful drag-and-drop operation.  \n`iFile` is the index of the file to query. Passing -1/0xFFFFFFFF will return the amount of files dropped  \nthe `WM_DROPFILES` window message sends an `HDROP` as the `WPARAM`");
registerFunc("DragFinish", "function DragFinish(hDrop : HDROP) : void", "Releases memory that the system allocated for use in transferring file names to the application.  \nthe `WM_DROPFILES` window message sends an `HDROP` as the `WPARAM`");

registerFunc("DragDetect", "function DragDetect(hwnd : HWND | number, point : POINT | {x, y}) : BOOL", "Captures the mouse and tracks its movement until the user releases the left button, presses the ESC key, or moves the mouse outside the drag rectangle around the specified point.  \nThe width and height of the drag rectangle are specified by the `SM_CXDRAG` and `SM_CYDRAG` values returned by the `GetSystemMetrics` function.  \nreturns 1 on success");


registerFunc("DllLoad", "function DllLoad(dllpath : String, dwFlags? : number) : function(procName : string, argCount : number, args : Array, argTypes : Array, returnvalue : number)", "this function follows the same rules as [LoadLibraryEx](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibraryexw) minus the reserved second param  \n`dwFlags` can be any `LOAD_` const (or 0 for the same effect as `LoadLibrary`)  \nthis returns a function where if any strings you pass into the dll must be wide (utf16?/wchar_t) use `VAR_WSTRING`, if the dll returns a string use `RETURN_WSTRING` if it is wide (utf16/wchar_t)  \npassing `__FREE` as procName will release the dll (internally calls `FreeLibrary`)  \n`argTypes` can be one `VAR_`... const  \n`returnvalue` can be one `RETURN_`... const"); //oh BROTHER how will i write docs for the function this returns
registerFunc("AddDllDirectory", "function AddDllDirectory(dir : string) : DLL_DIRECTORY_COOKIE", "Adds a directory to the process DLL search path. (**only works when specifying `LOAD_LIBRARY_SEARCH_USER_DIRS` with `DllLoad`/`LoadLibraryEx`**)  \n`dir` is an absolute path to the directory to add to the search path  \nreturns a pointer that can be passed to `RemoveDllDirectory` to remove the DLL from the process DLL search path.");
registerFunc("SetDllDirectory", "function SetDllDirectory(dir : string) : BOOL", "if `dir` is empty, the call removes the current directory from the default DLL search order.  \nIf `dir` is **NULL**, the function restores the default search order.  \nEach time the `SetDllDirectory` function is called, it replaces the directory specified in the previous `SetDllDirectory` call. To specify more than one directory, use the `AddDllDirectory` function and call `DllLoad`/`LoadLibraryEx` with `LOAD_LIBRARY_SEARCH_USER_DIRS`.");
registerFunc("RemoveDllDirectory", "function RemoveDllDirectory(cookie : DLL_DIRECTORY_COOKIE) : BOOL", "Removes a directory that was added to the process DLL search path by using `AddDllDirectory`.  \n`cookie` is a value returned from `AddDllDirectory` and after this function returns, the cookie is no longer valid and should not be used.");
registerFunc("LoadLibraryEx", "function LoadLibraryEx(filename : wstr, dwFlags : number) : HMODULE | number", "`dwFlags` can be and `LOAD_`... const  \nusually LoadLibraryEx has 3 parameters but the second one MUST be NULL so i just didn't add that  \nCall `FreeLibrary` when you are done with this module");
registerFunc("GetProcAddress", "function GetProcAddress(dll : HMODULE | number, funcName : string) : FARPROC | number", "`dll` is a pointer returned from `LoadLibraryEx`  \n`funcName` is the name of the function to find  \nreturns a pointer to the function (use `Call` to run le function)");
registerFunc("Call", "function Call(funcPtr : FARPROC | number, argCount : number, parameters : Array<>, paramTypes : Array<`VAR_`...>, returnType : `RETURN_`... | number) : any", "calls `func_ptr` with the specified number of arguments (`argCount`), interprets the specified array of `parameters` as their corresponding `paramTypes` (any `VAR`... const!) and returns based on the `returnType` (one `RETURN_`... const!)");
registerFunc("FreeLibrary", "function FreeLibrary(dll : HMODULE | number) : BOOL", "frees the memory or something like that you know...  \nreturns 1 if success");

registerFunc("InitializeWIC", "function InitializeWIC(void) : number | ptr", "used to load bitmaps (like pngs, jpgs, gifs, bmps, icos...) (for d2d (d2d.`CreateBitmapFromWicBitmap`) or GDI (using a dibsection))");
registerFunc("ScopeGUIDs", "function ScopeGUIDs(scope : this) : void", "for some reason i gotta use this weird function instead of setting these values in the initialization of JBS  \n(**allows you to use any `GUID_`... const**)");

registerFunc("GetControllers", "function GetControllers(void) : Array<number>", "returns a list of controller ids (if any controllers are plugged in) from 0-3 (only a max of 4 controllers connected)");
registerFunc("XInputGetState", "function XInputGetState(id : number) : XINPUT_STATE", "id is any number from 0-3 (id can be gained from GetControllers)  \nreturns an object with info about the controller (or will crash with an error LO!)");
registerFunc("XInputSetState", "function XInputSetState(id : number, wLeftMotorSpeed : number, wRightMotorSpeed : number) : DWORD", "id is any number from 0-3 (id can be gained from GetControllers)  \nreturns the result (0 for success)  \nThe left motor is the low-frequency rumble motor. The right motor is the high-frequency rumble motor. The two motors are not the same, and they create different vibration effects.");

registerFunc("hid_init", "function hid_init(void) : number", "apparently you don't actually have to call this one (because hid_open and `hid_enumerate` will call it anyways)  \nreturns 0 if success");
registerFunc("hid_enumerate", "function hid_enumerate(vendor_id : number, product_id : number, callback : Function(device : hid_device_info)) : void", "`vender_id` and `product_id` can be 0x0 to enumerate through all HIDs  \ncallback is a function that gets passed a device");
registerFunc("hid_open", "function hid_open(vendor_id : number, product_id : number, serial_number? : number) : number", "the `vendor_id` and `product_id` can be gained from one of the devices from `hid_enumerate`  \nyou can pass NULL for the `serial_number`  \nreturns a pointer to the handle");
registerFunc("hid_open_path", "function hid_open_path(path : string) : number", "path is the path string from a device from `hid_enumerate`  \nreturns a pointer to the handle");
registerFunc("hid_get_handle_from_info", "function hid_get_handle_from_info(device_info : hid_device_info) : number", "`device_info` is one of the devices from `hid_enumerate`  \nreturns a pointer to the handle");
registerFunc("hid_get_manufacturer_string", "function hid_get_manufacturer_string(handle : number) : number | string", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`  \nreturns -1 if failed or a string containing the info");
registerFunc("hid_get_product_string", "function hid_get_product_string(handle : number) : number | string", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`  \nreturns -1 if failed or a string containing the info");
registerFunc("hid_get_serial_number_string", "function hid_get_serial_number_string(handle : number) : number | string", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`  \nreturns -1 if failed or a string containing the info");
registerFunc("hid_get_indexed_string", "function hid_get_indexed_string(handle : number, i : number) : number | string", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`  \n`i` is any number but most of the time any number past like 5 doesn't work  \nreturns -1 if failed or a string containing the info");
registerFunc("hid_set_nonblocking", "function hid_set_nonblocking(handle : number, nonblocking : boolean) : number", "future `hid_read`s will not block the thread if `nonblocking` is true  \nreturns 0 if success");
registerFunc("hid_read", "function hid_read(handle : number) : Uint32Array", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`");
registerFunc("hid_read_timeout", "function hid_read_timeout(handle : number, timeoutMS : number) : Uint32Array", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`");
registerFunc("hid_write", "function hid_write(handle : number, buffer : Uint32Array, length : number) : Uint32Array", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`  \n");
registerFunc("hid_error", "function hid_error(handle : number) : wstring", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`  \nsimilar to GetLastError except it returns a string that says what the problem was");
registerFunc("hid_send_feature_report", "function hid_send_feature_report(handle : number, buffer : Uint32Array, length : number) : number", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`  \nreturns 0 if success");
registerFunc("hid_get_feature_report", "function hid_get_feature_report(handle : number, buffer : Uint32Array) : number | Uint32Array", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`  \nreturns -1 if failed or a Uint32Array containing the feature report");
registerFunc("hid_close", "function hid_close(handle : number) : void", "`handle` is a device (pointer) gained from `hid_open`, `hid_open_path`, or `hid_get_handle_from_info`");
registerFunc("hid_exit", "function hid_exit(void) : number", "returns 0 if success");

registerFunc("StringFromPointer", "function StringFromPointer(ptr : number) : string", "will crash if the ptr is null  \ncan be used with SendMessage and WPARAM and LPARAMs in special situations");
registerFunc("WStringFromPointer", "function WStringFromPointer(ptr : number) : wstring", "will crash if the ptr is null  \ncan be used with SendMessage and WPARAM and LPARAMs in special situations");
registerFunc("ArrayBufferFromPointer", "function ArrayBufferFromPointer(type : number, bits : number, data : number, byteLength : number) : TypedArray", "`type` and `bits` denote the kind of TypedArray returned  \nwhen `type` is 0 the array will be an Int{`bits`}Array,  \nwhen `type` is 1 it returns a Uint{`bits`}Array,  \nwhen `type` is 2 it returns a Float{`bits`}Array  \n\n`bits` can be 8, 16, 32, or 64 (passing `type` as 2 (float) only supports 32 and 64)  \n`data` is a pointer to some shit  \n`byteLength`  \nthe only reason to use this function is probably for `DllLoad`");
registerFunc("PointerFromArrayBuffer", "function PointerFromArrayBuffer(data : TypedArray | ArrayBufferView) : number", "`data` can be any Uint or Int or Float typed arrays  \nreturns the internal pointer of the data (is valid for as long as the arraybuffer is active)");

registerFunc("SoundSentry", "function SoundSentry(void) : number", "Triggers a visual signal to indicate that a sound is playing. (apparently)  \nSet the notification behavior by calling SystemParametersInfo with the SPI_SETSOUNDSENTRY value.");

registerFunc("spawn", "function spawn(func : Function) : void", "just like the lua spawn function (except i can't find any info on it for some reason?)  \nanyways it \"spawns\" a new thread and runs the function in it  \nprobably **use this one at your own risk** because it might just crash randomly and idk what's up with that ~~(this hasn't happened to me YET but it has other times)~~ this shit buggy as hell");

registerFunc("SetWinEventHook", "function SetWinEventHook(eventMin : number, eventMax : number, dllHandle : NULL | HMODULE, eventProc : Function(hook, event, hwnd, idObject, idChild, idEventThread, dwmsEventTime), idProcess : number, idThread : number, dwFlags : number) : void", "eventMin and eventMax can be any `EVENT_` const  \ndllHandle can probably just be `NULL`  \n`idProcess` can be 0 for all processes and `idThread` can be 0 for all threads on the desktop  \ndwFlags can be any `WINEVENT_` const");
registerFunc("UnhookWinEvent", "function UnhookWinEvent(hook : HWINEVENTHOOK | number) : BOOL", "hook must be a value returned from SetWinEventHook  \nreturns true if success");

registerFunc("GetWindowThreadProcessId", "function GetWindowThreadProcessId(hwnd : HWND | number) : {processID, thread}", "returns an object with `processID` and `thread` properties");

registerFunc("GetProcessMemoryInfo", "function GetProcessMemoryInfo(hProcess : HANDLE) : {cb, PageFaultCount, PeakWorkingSetSize, WorkingSetSize, QuotaPeakPagedPoolUsage, QuotaPagedPoolUsage, QuotaPeakNonPagedPoolUsage, QuotaNonPagedPoolUsage, PagefileUsage, PeakPagefileUsage, PrivateUsage}", "");

registerFunc("EnumProcesses", "function EnumProcesses(func : Function(pid)) : void", "gives the process ids of all running processes probably i thuink");
registerFunc("OpenProcess", "function OpenProcess(dwFlags : number, bInheritHandle : boolean, dwProcessId : number) : HANDLE", "`dwFlags` can be any `PROCESS_`... const (and can be OR'd together)  \n`bInheritHandle` can probably just be `false`  \nuse EnumProcesses to iterate through a list of process ids for `dwProcessId`");
registerFunc("GetCurrentProcess", "function GetCurrentProcess(void) : HANDLE", "Retrieves a pseudo handle for the current process.  \nA pseudo handle is a special constant, currently (**HANDLE**)-1, that is interpreted as the current process handle.  \nFor compatibility with future operating systems, it is best to call `GetCurrentProcess` instead of hard-coding this constant value.");
registerFunc("EnumProcessModules", "function EnumProcessModules(hProcess : HANDLE) : Array<[HMODULE, DWORD, BOOL]>", "`hProcess` can be obtained by calling `OpenProcess(...)`  \nreturns an array with 3 values  \nthis one seems a little confusing so see wintilemanager for use");
registerFunc("EnumProcessModulesEx", "function EnumProcessModulesEx(hProcess : HANDLE, dwFlags : number) : Array<[HMODULE, DWORD, BOOL]>", "`hProcess` can be obtained by calling `OpenProcess(...)`  \ndwFlags can be any `LIST_MODULES_`... const   \nreturns an array with 3 values  \nthis one seems a little confusing so see wintilemanager for use");
registerFunc("GetModuleBaseName", "function GetModuleBaseName(hProcess : HANDLE, hMod : HMODULE) : wstr", "`hProcess` can be obtained by calling `OpenProcess(...)` and `hMod` can be obtained by calling `EnumProcessModules`  \nreturns the name or undefined (apparently)");
registerFunc("GetModuleFileName", "function GetModuleFileName(hMod : HMODULE) : wstr", "`hMod` can be obtained by calling `EnumProcessModules`  \nreturns the path of the file that contains the module");
registerFunc("GetModuleFileNameEx", "function GetModuleFileNameEx(hProcess : HANDLE, hMod : HMODULE) : wstr", "`hProcess` can be obtained by calling `OpenProcess(...)` and `hMod` can be obtained by calling `EnumProcessModules`  \nreturns the path of the file that contains the module");
registerFunc("CloseHandle", "function CloseHandle(hObject : HANDLE) : BOOL", "use on HANDLE(s) returned from `OpenProcess` when done with them  \ndo not call CloseHandle on any HMODULE(s) returned from both `EnumProcessModules(Ex)`  \nreturns 1 if success");

registerFunc("GlobalMemoryStatusEx", "function GlobalMemoryStatusEx(void) : {}", "returns an object with alot of info about current memory availability");

registerFunc("EasyTab_Load", "function EasyTab_Load(window : HWND | number) : EasyTabResult | number", "returns an `EASYTAB_`... const and if this function was successful  it returns `EASYTAB_OK`");
registerFunc("EasyTab_Load_Ex", "function EasyTab_Load_Ex(window : HWND | number, trackingMode : EasyTabTrackingMode | number, relativeModeSensitivity : float, moveCursor : number) : EasyTabResult | number", "trackingMode is any `EASYTAB_TRACKING_MODE_`... const  \nhonestly i think moveCursor should just be boolean but idk  \nreturns an `EASYTAB_`... const and if this function was successful  it returns `EASYTAB_OK`");
registerFunc("EasyTab_HandleEvent", "function EasyTab_HandleEvent(window : HWND | number, msg : number, lp : number, wp : number) : ", "use this function in your window procedure function (check `neweasytabfuncs.js`)  \nreturns an `EASYTAB_`... const and if this function was successful  it returns `EASYTAB_OK`");
registerFunc("EasyTab_GetPosX", "function EasyTab_GetPosX(void) : number", "(check `neweasytabfuncs.js` for use)");
registerFunc("EasyTab_GetPosY", "function EasyTab_GetPosY(void) : number", "(check `neweasytabfuncs.js` for use)");
registerFunc("EasyTab_GetPressure", "function EasyTab_GetPressure(void) : number", "(check `neweasytabfuncs.js` for use)");
registerFunc("EasyTab_GetButtons", "function EasyTab_GetButtons(void) : number", "(check `neweasytabfuncs.js` for use)");
registerFunc("EasyTab_GetRangeX", "function EasyTab_GetRangeX(void) : number", "(check `neweasytabfuncs.js` for use)");
registerFunc("EasyTab_GetRangeY", "function EasyTab_GetRangeY(void) : number", "(check `neweasytabfuncs.js` for use)");
registerFunc("EasyTab_GetMaxPressure", "function EasyTab_GetMaxPressure(void) : number", "haha max design pro");
registerFunc("EasyTab_Unload", "function EasyTab_Unload(void) : void", "use this function when you no longer need EasyTab");

registerFunc("MAKELPARAM", "function MAKELPARAM(low : number, high : number) : number", "`low` is the low-order WORD (unsigned short) of the returned value  \n`high` is the high-order WORD (unsigned short) of the returned value  \nuse `MAKELPARAM` for `SendMessage` with a progress bar hwnd and `PBM_SETRANGE`  \n`<---------------DWORD--------------->`  \n`[00000000:00000000:00000000:00000000]`  \n`<-----HIWORD-----><------LOWORD----->`");
registerFunc("MAKEWORD", "function MAKEWORD(lo : number, hi : number) : number", "`low` is the low-order byte of the new value  \n`high` is the high-order byte of the new value  \nCreates a WORD value (unsigned short) by concatenating the specified values.");

registerFunc("MakeRAWINPUTDEVICE", "function MakeRAWINPUTDEVICE(usUsagePage : number, usUsage : number, dwFlags : number, hwndTarget : HWND) : {usUsagePage, usUsage, dwFlags, hwndTarget}", "convenience function for use with `RegisterRawInputDevices`  \ninfo about `usUsagePage` and `usUsage` can be found on these helpful charts [here](https://learn.microsoft.com/en-us/windows-hardware/drivers/hid/top-level-collections-opened-by-windows-for-system-use) and [here](https://learn.microsoft.com/en-us/windows-hardware/drivers/hid/hid-usages#usage-page)  \n`dwFlags` can be any [`RIDEV_`... const](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-rawinputdevice) (i think they can be OR'd together)  \n`hwndTarget` can be NULL or your window (msdn says If **NULL**, raw input events follow the keyboard focus to ensure only the focused application window receives the events.)");
registerFunc("RegisterRawInputDevices", "function RegisterRawInputDevices(deviceList : Array<RAWINPUTDEVICE> | RAWINPUTDEVICE)", "`deviceList` must be either an array or a single object containing `usUsagePage`, `usUsage`, `dwFlags`, and `hwndTarget` properties (an easy way to get such an object is to use the `MakeRAWINPUTDEVICE` function)");
registerFunc("GetRawInputDeviceListLength", "function GetRawInputDeviceListLength() : number", "returns the amount of raw devices connected i think (for optional use with `GetRawInputDeviceList`)");
registerFunc("GetRawInputDeviceList", "function GetRawInputDeviceList(count? : number) : Array<{hDevice, dwType}>", "`count` is optional now lol but if you do use it don't put a large number because that shit will probably blow up  \nif successful will return an array of objects with `hDevice` (HANDLE) and `dwType` (`RID_TYPE`...) properties (for use with the `GetRawInputDeviceInfo` function)");
registerFunc("GetRawInputDeviceInfo", "function GetRawInputDeviceInfo(hDevice : HANDLE | number, uiCommand : number) : any", "depending on the `uiCommand` this function can return one of two things,  \nif the `uiCommand` is `RIDI_DEVICENAME` it will return a string  \nif the `uiCommand` is `RIDI_DEVICEINFO` it will return an object with properties relating to what kind of device it is  \nidk what `RIDI_PREPARSEDDATA` does yet");
registerFunc("GET_RAWINPUT_CODE_WPARAM", "function GET_RAWINPUT_CODE_WPARAM(wp : WPARAM | number) : number", "can return 0 (for `RIM_INPUT`) - meaning that input occured while the application was in the foreground  \nor 1 (for `RIM_INPUTSINK`) - meaning that the input occured while the application was not in the foreground");
registerFunc("GetRawInputData", "function GetRawInputData(lp : LPARAM | number, uiCommand : number) : {header: {dwType, dwSize, hDevice, wParam}, ...?}", "if `uiCommand` is `RID_HEADER` then this command (if successful) returns an object with the properties listed in the header  \nif `uiCommand` is `RID_INPUT` then this command (if successful) returns an object with those properties listed in the header and a `data` property with additional properties relating to the type of device (the type of device can be checked with the header's `dwType` and `RIM_TYPE`... consts)");

registerFunc("GetMessageExtraInfo", "function GetMessageExtraInfo(void) : LPARAM : number", "returns additional message info (if there is any idk look [here](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessageextrainfo))");
registerFunc("SetMessageExtraInfo", "function SetMessageExtraInfo(lp : LPARAM | number) : LPARAM : number", "returns the last LPARAM value");

registerFunc("RegisterHotKey", "function RegisterHotKey(hwnd : HWND | number, id : number, modifiers : number, keyCode : number) : BOOL", "`hwnd` is the window you want to send these events to (with `WM_HOTKEY`) or you can pass `NULL` and the hotkeys will be associated with the current thread  \n`id` can be any number in the range 0x0000 through 0xBFFF  \n`modifiers` are any `MOD_`... consts (which can be OR'd together)  \n`keyCode` can be any `VK_`... const or (for keys that aren't included in the VK consts) can be found from [this list](https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes) OR a third option just use `'{letter}'.charCodeAt(0)`  \nIf a hot key already exists with the same `hWnd` and `id` parameters, it is maintained along with the new hot key. The application must explicitly call `UnregisterHotKey` to unregister the old hot key.  \nreturns 1 if success");
registerFunc("UnregisterHotKey", "function UnregisterHotKey(hwnd : HWND | number, id : number) : BOOL", "A handle to the window associated with the hot key to be freed. This parameter should be NULL if the hot key is not associated with a window.  \n`id` is the identifier of the hotkey to be freed  \nreturns 1 if success");

registerFunc("EnumPropsEx", "function EnumPropsEx(hwnd, func : Function(key : string, value : number)) : void", "Enumerates all entries in the property list of a window by passing them, one by one, to the specified callback function. `EnumPropsEx` continues until the last entry is enumerated.  \nthis function might crash but i think i fixed it maybe");

//honestly it's suprising this hasn't been added it because it's the most low level type function i've added
registerFunc("NewCharStrPtr", "function NewCharStrPtr(str : string) : number", "This function puts `str` into a `new` char* and that pointer is returned  \n**use `DeleteArrayPtr` to free this memory**  \ndon't forget to free this shit bruh");
registerFunc("NewWCharStrPtr", "function NewWCharStrPtr(wstr : string) : number", "This function puts `wstr` into a `new` wchar_t* and that pointer is returned  \n**use `DeleteArrayPtr` to free this memory**  \ndon't forget to free this shit bruh");
registerFunc("DeletePtr", "function DeletePtr(ptr : number) : void", "Deletes a scalar pointer");
registerFunc("DeleteArrayPtr", "function DeleteArrayPtr", "Deletes a vector pointer  \nuse this function on the value returned by `NewCharStrPtr` when you're done!");

registerFunc("VirtualProtect", "function VirtualProtect(address : LPVOID | number, size : number, newProtect : number) : number", "Changes the protection on a region of committed pages in the virtual address space of the calling process.  \n`size` is the size of the region whose access protection attributes are to be changed, **in bytes**.  \nnewProtect can be any `PAGE_`... const  \nif success, returns the old access protection value");

registerFunc("FlushInstructionCache", "function FlushInstructionCache(process : HANDLE : number, baseAddress? : number, size? : number) : BOOL", "idk if you *have* to call it but  \nApplications should call `FlushInstructionCache` if they generate or modify code in memory (like in `scripts/dllstuffs/CALLASM.js`). The CPU cannot detect the change, and may execute the old code it cached.  \n`baseAddress` and `size` can both be **NULL**  \n`baseAddress` is the pointer of the base of the region to be flushed. This parameter can be NULL.  \n`size` is the size of the region to be flushed if `baseAddress` isn't NULL, **in bytes**.");

registerFunc("GetDlgItem", "function GetDlgItem(hDlg : HWND | number, id : number) : HWND", "Retrieves a handle to a control in the specified dialog box.  \n`id` is the identifier of the control to be retrieved.  \nYou can use the `GetDlgItem` function with any parent-child window pair, not just with dialog boxes. As long as the `hDlg` parameter specifies a parent window and the child window has a unique identifier. (as specified by the `hMenu` parameter of `CreateWindow`)");

registerFunc("FindFirstChangeNotification", "function FindFirstChangeNotification(pathName : wstring, watchSubtree : BOOL, notifyFilter : number) : HANDLE | number", "Creates a change notification handle and sets up initial change notification filter conditions.  \nWhen the returned handle is no longer needed, close it by using the `FindCloseChangeNotification` function.  \nThis function does not return when a change occurs. You must call `WaitForSingleObject`!  \nBy default, the `pathName` is limited to MAX_PATH (usually 260) characters. To extend this limit to 32,767 wide characters, prepend \"\\?\\\" to the path. For more information, see [Naming Files, Paths, and Namespaces](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file).  \n`notifyFilter` is any `FILE_NOTIFY_CHANGE_`... const (can be OR'd together)");
registerFunc("FindNextChangeNotification", "function FindNextChangeNotification(hChangeHandle : HANDLE | number) : BOOL", "Requests that the operating system signal a change notification handle the next time it detects an appropriate change.  \n`hChangeHandle` is a handle to a change notification handle created by the `FindFirstChangeNotification` function.  \nWhen `hChangeHandle` is no longer needed, close it by using the `FindCloseChangeNotification` function.");
registerFunc("FindCloseChangeNotification", "function FindCloseChangeNotification(hChangeHandle : HANDLE | number) : BOOL", "Stops change notification handle monitoring.  \n`hChangeHandle` is a handle to a change notification handle created by the `FindFirstChangeNotification` function.  \nAfter the this function is called, the handle specified by the `hChangeHandle` parameter cannot be used in subsequent calls to either the `FindNextChangeNotification` or `FindCloseChangeNotification` function.");
registerFunc("WaitForSingleObject", "function WaitForSingleObject(handle : HANDLE | number, milliseconds : number, alertable : BOOL) : number", "if `milliseconds` is 0 then this function returns immediately. To wait indefinitely, pass `0xFFFFFFFF`.  \nreturns a `WAIT_`... const indicating what caused this function to return.  \nThe `WaitForSingleObject` function can wait for the following objects:  \n* Change notification  \n* Console input  \n* Event  \n* Memory resource notification  \n* Mutex  \n* Process  \n* Semaphore  \n* Thread  \n* Waitable timer");

registerFunc("__debugbreak", "function __debugbreak(void) : void", "**this function will crash jbs if it's not attached to a debugger!**  \npauses execution (where this function is defined in JBS3.cpp)  \nwhen compiled, this function is replaced by the `int 3` asm instruction (0xcc)");

registerFunc("TrackMouseEvent", "function TrackMouseEvent(dwFlags : number, hwndTrack : HWND | number, dwHoverTime : number) : BOOL | {dwFlags, hwndTrack, dwHoverTime}", "  \n`dwFlags` can be any `TME_`... const (some can be OR'd together)  \n`dwHoverTime` can be the hover time-out in milliseconds (use the `HOVER_DEFAULT` const to use the system default hover time-out)  \n**TME_HOVER and TME_LEAVE will not work if the mouse is not already over the window!**  \n**After you receive an event from `TrackMouseEvent` you must call it again to receive further events!**  \nIf you specify `TME_QUERY` this function will return an object containing the current tracking settings");

function emptyD2DObject() : Array<[string, vscode.CompletionItemKind?]> {
    return [["internalPtr"], ["Release", vscode.CompletionItemKind.Method]];//{props: [["internalPtr"], ["Release", vscode.CompletionItemKind.Method]]};
}

function defaultBrushObject() : Array<[string, vscode.CompletionItemKind?]> {
    return /*{props: */[["internalPtr"], ["brush"], ["SetOpacity", vscode.CompletionItemKind.Method], ["GetOpacity", vscode.CompletionItemKind.Method], ["GetTransform", vscode.CompletionItemKind.Method], ["SetTransform", vscode.CompletionItemKind.Method], ["Release", vscode.CompletionItemKind.Method]];//};
}

function defaultTextFormatObject() : Array<[string, vscode.CompletionItemKind?]> {
    return [["internalPtr"], ["Release", vscode.CompletionItemKind.Method], /*["family"],*/ ["GetFontSize", vscode.CompletionItemKind.Method], ["GetFlowDirection", vscode.CompletionItemKind.Method], ["GetFontFamilyName", vscode.CompletionItemKind.Method], ["GetFontFamilyNameLength", vscode.CompletionItemKind.Method], ["GetFontStretch", vscode.CompletionItemKind.Method], ["GetFontStyle", vscode.CompletionItemKind.Method] ,["GetFontWeight", vscode.CompletionItemKind.Method] ,["GetIncrementalTabStop", vscode.CompletionItemKind.Method], ["GetLineSpacing", vscode.CompletionItemKind.Method], ["GetParagraphAlignment", vscode.CompletionItemKind.Method], ["GetReadingDirection", vscode.CompletionItemKind.Method], ["GetTextAlignment", vscode.CompletionItemKind.Method], ["GetWordWrapping", vscode.CompletionItemKind.Method], ["GetTrimming", vscode.CompletionItemKind.Method], ["SetFlowDirection", vscode.CompletionItemKind.Method], ["SetIncrementalTabStop", vscode.CompletionItemKind.Method], ["SetLineSpacing", vscode.CompletionItemKind.Method], ["SetParagraphAlignment", vscode.CompletionItemKind.Method], ["SetReadingDirection", vscode.CompletionItemKind.Method],["SetTextAlignment", vscode.CompletionItemKind.Method],["SetTrimming", vscode.CompletionItemKind.Method],["SetWordWrapping", vscode.CompletionItemKind.Method],["SetFontSize", vscode.CompletionItemKind.Method]];
}

function d2dCanvasObject() : Array<[string, vscode.CompletionItemKind?]> {
    return [["internalDXPtr"], ["renderTarget"], ["CreateBitmapFromFilename", vscode.CompletionItemKind.Method], ["BeginDraw", vscode.CompletionItemKind.Method], ["EndDraw", vscode.CompletionItemKind.Method], ["Resize", vscode.CompletionItemKind.Method], ["CreateSolidColorBrush", vscode.CompletionItemKind.Method], ["DrawRectangle", vscode.CompletionItemKind.Method], ["DrawGradientRectangle", vscode.CompletionItemKind.Method], ["FillRectangle", vscode.CompletionItemKind.Method], ["FillGradientRectangle", vscode.CompletionItemKind.Method], ["DrawGradientEllipse", vscode.CompletionItemKind.Method], ["DrawEllipse", vscode.CompletionItemKind.Method], ["FillEllipse", vscode.CompletionItemKind.Method], ["FillGradientEllipse", vscode.CompletionItemKind.Method], ["CreateFont", vscode.CompletionItemKind.Method], ["CreateTextLayout", vscode.CompletionItemKind.Method], ["EnumFonts", vscode.CompletionItemKind.Method], ["DrawText", vscode.CompletionItemKind.Method], ["DrawTextLayout", vscode.CompletionItemKind.Method], ["DrawGradientText", vscode.CompletionItemKind.Method], ["CreateBitmap", vscode.CompletionItemKind.Method], ["CreateBitmapFromWicBitmap", vscode.CompletionItemKind.Method], ["DrawBitmap", vscode.CompletionItemKind.Method], ["CreateBitmapBrush", vscode.CompletionItemKind.Method], ["CreateGradientStopCollection", vscode.CompletionItemKind.Method], ["CreateLinearGradientBrush", vscode.CompletionItemKind.Method], ["CreateRadialGradientBrush", vscode.CompletionItemKind.Method], ["RestoreDrawingState", vscode.CompletionItemKind.Method], /*["CreateDrawingStateBlock", vscode.CompletionItemKind.Method],*/ ["GetTransform", vscode.CompletionItemKind.Method], ["SetTransform", vscode.CompletionItemKind.Method], ["SaveDrawingState", vscode.CompletionItemKind.Method], ["DrawGradientRoundedRectangle", vscode.CompletionItemKind.Method], ["DrawRoundedRectangle", vscode.CompletionItemKind.Method], ["FillRoundedRectangle", vscode.CompletionItemKind.Method], ["FillGradientRoundedRectangle", vscode.CompletionItemKind.Method], ["Flush", vscode.CompletionItemKind.Method], ["GetAntialiasMode", vscode.CompletionItemKind.Method], ["SetAntialiasMode", vscode.CompletionItemKind.Method], ["SetDpi", vscode.CompletionItemKind.Method], ["GetDpi", vscode.CompletionItemKind.Method], ["GetMaximumBitmapSize", vscode.CompletionItemKind.Method], ["GetSize", vscode.CompletionItemKind.Method], ["GetPixelSize", vscode.CompletionItemKind.Method], ["DrawLine", vscode.CompletionItemKind.Method], ["DrawGradientLine", vscode.CompletionItemKind.Method], ["Clear", vscode.CompletionItemKind.Method], ["Release", vscode.CompletionItemKind.Method]];
}

function d2dCanvasObject11() : Array<[string, vscode.CompletionItemKind?]> {
    return [...d2dCanvasObject(), ["AcquireNextFrame", vscode.CompletionItemKind.Method], ["CreateEffect", vscode.CompletionItemKind.Method], ["Present", vscode.CompletionItemKind.Method], ["SetTarget", vscode.CompletionItemKind.Method], ["CreateBitmapFromDxgiSurface", vscode.CompletionItemKind.Method]];
}

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const RectObject : JBSObjects = {props: [["left"], ["top"], ["right"] ,["bottom"]]};
	const PointObject : JBSObjects = {props: [["x"], ["y"]]};
	const PaintStruct : JBSObjects = {props: [["fErase"], ["fIncUpdate"], ["fRestore"], ["hdc"], ["rcPaint", vscode.CompletionItemKind.Class], ["ps"]]};
	const RequireObject : JBSObjects = {props: [["read", vscode.CompletionItemKind.Method], ["write", vscode.CompletionItemKind.Method]]};
	const WindowClassObject : JBSObjects = {props: [["loop", vscode.CompletionItemKind.Method], ["windowProc", vscode.CompletionItemKind.Method], ["init", vscode.CompletionItemKind.Method], ["hbrBackground"],["hCursor"],["hIcon"],["hIconSm"],["hInstance"], ["lpszClassName"], ["lpszMenuName"], ["style"], ["DefWindowProc"]]};//["className"]]};
	const CanvasObject : JBSObjects = {props: d2dCanvasObject()};
	const CanvasObject11 : JBSObjects = {props: d2dCanvasObject11()};
    const CanvasObject11DComp : JBSObjects = {props: [...d2dCanvasObject11(), ["SetDCompEffect", vscode.CompletionItemKind.Method], ["Commit", vscode.CompletionItemKind.Method], ["CreateGaussianBlurEffect", vscode.CompletionItemKind.Method], ["CreateBrightnessEffect", vscode.CompletionItemKind.Method], ["CreateColorMatrixEffect", vscode.CompletionItemKind.Method], ["CreateShadowEffect", vscode.CompletionItemKind.Method], ["CreateHueRotationEffect", vscode.CompletionItemKind.Method], ["CreateSaturationEffect", vscode.CompletionItemKind.Method], ["CreateTurbulenceEffect", vscode.CompletionItemKind.Method], ["CreateLinearTransferEffect", vscode.CompletionItemKind.Method], ["CreateTableTransferEffect", vscode.CompletionItemKind.Method], ["CreateCompositeEffect", vscode.CompletionItemKind.Method], ["CreateBlendEffect", vscode.CompletionItemKind.Method], ["CreateArithmeticCompositeEffect", vscode.CompletionItemKind.Method], ["CreateAffineTransform2DEffect", vscode.CompletionItemKind.Method]]};
	const GLObject : JBSObjects = {props: [["activeTexture", vscode.CompletionItemKind.Method], ["attachShader", vscode.CompletionItemKind.Method], ["bindBuffer", vscode.CompletionItemKind.Method], ["bindFramebuffer", vscode.CompletionItemKind.Method], ["bindRenderbuffer", vscode.CompletionItemKind.Method], ["bindTexture", vscode.CompletionItemKind.Method], ["blendColor", vscode.CompletionItemKind.Method], ["blendEquation", vscode.CompletionItemKind.Method], ["blendEquationSeparate", vscode.CompletionItemKind.Method], ["blendFunc", vscode.CompletionItemKind.Method], ["blendFuncSeparate", vscode.CompletionItemKind.Method], ["checkFramebufferStatus", vscode.CompletionItemKind.Method], ["clear", vscode.CompletionItemKind.Method], ["clearColor", vscode.CompletionItemKind.Method], ["clearDepth", vscode.CompletionItemKind.Method], ["clearStencil", vscode.CompletionItemKind.Method], ["colorMask", vscode.CompletionItemKind.Method], ["compileShader", vscode.CompletionItemKind.Method], ["copyTexImage2D", vscode.CompletionItemKind.Method], ["copyTexSubImage2D", vscode.CompletionItemKind.Method], ["createBuffer", vscode.CompletionItemKind.Method], ["createFramebuffer", vscode.CompletionItemKind.Method], ["createProgram", vscode.CompletionItemKind.Method], ["createRenderbuffer", vscode.CompletionItemKind.Method], ["createShader", vscode.CompletionItemKind.Method], ["createTexture", vscode.CompletionItemKind.Method], ["cullFace", vscode.CompletionItemKind.Method], ["deleteBuffer", vscode.CompletionItemKind.Method], ["deleteFramebuffer", vscode.CompletionItemKind.Method], ["deleteProgram", vscode.CompletionItemKind.Method], ["deleteRenderbuffer", vscode.CompletionItemKind.Method], ["deleteShader", vscode.CompletionItemKind.Method], ["deleteTexture", vscode.CompletionItemKind.Method], ["depthFunc", vscode.CompletionItemKind.Method], ["depthMask", vscode.CompletionItemKind.Method], ["depthRange", vscode.CompletionItemKind.Method], ["detachShader", vscode.CompletionItemKind.Method], ["disable", vscode.CompletionItemKind.Method], ["disableVertexAttribArray", vscode.CompletionItemKind.Method], ["drawArrays", vscode.CompletionItemKind.Method], ["enable", vscode.CompletionItemKind.Method], ["enableVertexAttribArray", vscode.CompletionItemKind.Method], ["finish", vscode.CompletionItemKind.Method], ["flush", vscode.CompletionItemKind.Method], ["framebufferRenderbuffer", vscode.CompletionItemKind.Method], ["framebufferTexture2D", vscode.CompletionItemKind.Method], ["frontFace", vscode.CompletionItemKind.Method], ["generateMipmap", vscode.CompletionItemKind.Method], ["getProgramParameter", vscode.CompletionItemKind.Method], ["getProgramInfoLog", vscode.CompletionItemKind.Method], ["getShaderInfoLog", vscode.CompletionItemKind.Method], ["getUniformLocation", vscode.CompletionItemKind.Method], ["hint", vscode.CompletionItemKind.Method], ["isBuffer", vscode.CompletionItemKind.Method], ["isEnabled", vscode.CompletionItemKind.Method], ["isFramebuffer", vscode.CompletionItemKind.Method], ["isProgram", vscode.CompletionItemKind.Method], ["isRenderbuffer", vscode.CompletionItemKind.Method], ["isShader", vscode.CompletionItemKind.Method], ["isTexture", vscode.CompletionItemKind.Method], ["lineWidth", vscode.CompletionItemKind.Method], ["linkProgram", vscode.CompletionItemKind.Method], ["pixelStorei", vscode.CompletionItemKind.Method], ["shaderSource", vscode.CompletionItemKind.Method], ["stencilFunc", vscode.CompletionItemKind.Method], ["stencilFuncSeparate", vscode.CompletionItemKind.Method], ["stencilMask", vscode.CompletionItemKind.Method], ["stencilMaskSeparate", vscode.CompletionItemKind.Method], ["stencilOp", vscode.CompletionItemKind.Method], ["stencilOpSeparate", vscode.CompletionItemKind.Method], ["texParameterf", vscode.CompletionItemKind.Method], ["texParameteri", vscode.CompletionItemKind.Method], ["uniform1f", vscode.CompletionItemKind.Method], ["uniform2f", vscode.CompletionItemKind.Method], ["uniform3f", vscode.CompletionItemKind.Method], ["uniform4f", vscode.CompletionItemKind.Method], ["uniform1i", vscode.CompletionItemKind.Method], ["uniform2i", vscode.CompletionItemKind.Method], ["uniform3i", vscode.CompletionItemKind.Method], ["uniform4i", vscode.CompletionItemKind.Method], ["useProgram", vscode.CompletionItemKind.Method], ["validateProgram", vscode.CompletionItemKind.Method], ["vertexAttribPointer", vscode.CompletionItemKind.Method], ["viewport", vscode.CompletionItemKind.Method], ["bufferData", vscode.CompletionItemKind.Method], ["texImage2D", vscode.CompletionItemKind.Method], ["texSubImage2D", vscode.CompletionItemKind.Method], ["uniform1fv", vscode.CompletionItemKind.Method], ["uniform2fv", vscode.CompletionItemKind.Method], ["uniform3fv", vscode.CompletionItemKind.Method], ["uniform4fv", vscode.CompletionItemKind.Method], ["uniform1iv", vscode.CompletionItemKind.Method], ["uniform2iv", vscode.CompletionItemKind.Method], ["uniform3iv", vscode.CompletionItemKind.Method], ["uniform4iv", vscode.CompletionItemKind.Method], ["uniformMatrix2fv", vscode.CompletionItemKind.Method], ["uniformMatrix3fv", vscode.CompletionItemKind.Method], ["uniformMatrix4fv", vscode.CompletionItemKind.Method]]};

    const IUnknownObject : JBSObjects = {props: emptyD2DObject()};

    const SolidColorBrushObject : JBSObjects = {props: [...defaultBrushObject(), ["SetColor", vscode.CompletionItemKind.Method], ["GetColor", vscode.CompletionItemKind.Method]]};
    const LinearGradientBrushObject : JBSObjects = {props: [...defaultBrushObject(), ["GetStartPoint", vscode.CompletionItemKind.Method], ["GetEndPoint", vscode.CompletionItemKind.Method], ["SetStartPoint", vscode.CompletionItemKind.Method], ["SetEndPoint", vscode.CompletionItemKind.Method], ["SetPoints", vscode.CompletionItemKind.Method]]};
    const RadialGradientBrushObject : JBSObjects = {props: [...defaultBrushObject(), ["GetCenter", vscode.CompletionItemKind.Method], ["GetGradientOriginOffset", vscode.CompletionItemKind.Method], ["GetRadiusX", vscode.CompletionItemKind.Method], ["GetRadiusY", vscode.CompletionItemKind.Method], ["GetRadius", vscode.CompletionItemKind.Method], ["SetCenter", vscode.CompletionItemKind.Method], ["SetGradientOriginOffset", vscode.CompletionItemKind.Method], ["SetRadiusX", vscode.CompletionItemKind.Method], ["SetRadiusY", vscode.CompletionItemKind.Method], ["SetRadius", vscode.CompletionItemKind.Method]]};

    const FontObject : JBSObjects = {props : [...defaultTextFormatObject(), ["internalDXPtr"]]};
    const TextLayoutObject : JBSObjects = {props : [...defaultTextFormatObject(), ["DetermineMinWidth", vscode.CompletionItemKind.Method],["GetDrawingEffect", vscode.CompletionItemKind.Method],["GetLineMetrics", vscode.CompletionItemKind.Method],["GetMaxHeight", vscode.CompletionItemKind.Method],["GetMaxWidth", vscode.CompletionItemKind.Method],["GetMetrics", vscode.CompletionItemKind.Method],["GetOverhangMetrics", vscode.CompletionItemKind.Method],["GetStrikethrough", vscode.CompletionItemKind.Method],["GetUnderline", vscode.CompletionItemKind.Method],["HitTestPoint", vscode.CompletionItemKind.Method],["HitTestTextPosition", vscode.CompletionItemKind.Method],["HitTestTextRange", vscode.CompletionItemKind.Method],["SetDrawingEffect", vscode.CompletionItemKind.Method],["SetFontFamilyName", vscode.CompletionItemKind.Method],["SetFontStretch", vscode.CompletionItemKind.Method],["SetFontStyle", vscode.CompletionItemKind.Method],["SetFontWeight", vscode.CompletionItemKind.Method],["SetMaxHeight", vscode.CompletionItemKind.Method],["SetMaxWidth", vscode.CompletionItemKind.Method],["SetStrikethrough", vscode.CompletionItemKind.Method],["SetUnderline", vscode.CompletionItemKind.Method]]};
    //bruh i added this and when i ran the extension nothing happened and vscode just stopped compiling the extension

    const BitmapObject : JBSObjects = {props : [...emptyD2DObject(), ["GetDpi", vscode.CompletionItemKind.Method], ["GetPixelFormat", vscode.CompletionItemKind.Method], ["GetPixelSize", vscode.CompletionItemKind.Method], ["GetSize", vscode.CompletionItemKind.Method], ["CopyFromBitmap", vscode.CompletionItemKind.Method], ["CopyFromRenderTarget", vscode.CompletionItemKind.Method], ["CopyFromMemory", vscode.CompletionItemKind.Method]]};
    const BitmapBrushObject : JBSObjects = {props : [...defaultBrushObject(), ["GetExtendModeX", vscode.CompletionItemKind.Method], ["GetExtendModeY", vscode.CompletionItemKind.Method], ["GetExtendMode", vscode.CompletionItemKind.Method], ["GetInterpolationMode", vscode.CompletionItemKind.Method], ["SetExtendModeX", vscode.CompletionItemKind.Method], ["SetExtendModeY", vscode.CompletionItemKind.Method], ["SetExtendMode", vscode.CompletionItemKind.Method], ["SetInterpolationMode", vscode.CompletionItemKind.Method], ["SetBitmap", vscode.CompletionItemKind.Method], ["GetBitmap", vscode.CompletionItemKind.Method]]};

    const WICObject : JBSObjects = {props : [...emptyD2DObject(), ["LoadBitmapFromFilename", vscode.CompletionItemKind.Method], ["LoadDecoder", vscode.CompletionItemKind.Method], ["ConvertBitmapSource", vscode.CompletionItemKind.Method], ["CreateBitmapFromHBITMAP", vscode.CompletionItemKind.Method], ["CreateBitmapFromHICON", vscode.CompletionItemKind.Method], ["LoadBitmapFromBinaryData", vscode.CompletionItemKind.Method]]};
    const WICBitmap : JBSObjects = {props : [...emptyD2DObject(), ["GetPixels", vscode.CompletionItemKind.Method], ["GetResolution", vscode.CompletionItemKind.Method], ["GetSize", vscode.CompletionItemKind.Method], ["GUID"], ["GetPixelFormat", vscode.CompletionItemKind.Method], ["Resize", vscode.CompletionItemKind.Method]]};
    const WICDecoder : JBSObjects = {props : [...emptyD2DObject(), ["GetFrameCount", vscode.CompletionItemKind.Method], ["GetBitmapFrame", vscode.CompletionItemKind.Method], ["GetThumbnail", vscode.CompletionItemKind.Method], ["GetPreview", vscode.CompletionItemKind.Method], ["GetContainerFormat", vscode.CompletionItemKind.Method]]};
    
// genius regex -> /"(.+)"/g regexr.com/7l8cl
// the regex tips and tricks are WAY too handy
//`...`.match(/".+"/g).join(" ").replaceAll(/".+?"/g, "[$&], ")

    const LineSpacingObject : JBSObjects = {props : [["lineSpacingMethod"], ["lineSpacing"], ["baseline"]]};
    const TrimmingObject : JBSObjects = {props : [["granularity"], ["delimiter"], ["delimiterCount"]]};

    const RGBObject : JBSObjects = {props : [["r"], ["g"], ["b"]]};

    const SIZEObject : JBSObjects = {props : [["width"],["height"]]};//[["cx"], ["cy"]]};

    const GDIHBITMAP : JBSObjects = {props : [["bmType"], ["bmWidth"], ["bmHeight"], ["bmWidthBytes"], ["bmPlanes"], ["bmBitsPixel"], ["bmBits"]]};
    const GDIDIBHBITMAP : JBSObjects = {props : [["dsBm", vscode.CompletionItemKind.Class], ["dsBmih", vscode.CompletionItemKind.Class], ["dsBitfields"], ["dshSection"], ["dsOffset"]]}; //yeah you just gonna have to find out what the props are
    const GDIExtLPEN : JBSObjects = {props : [["elpPenStyle"],  ["elpWidth"],  ["elpBrushStyle"],  ["elpColor"],  ["elpHatch"],  ["elpNumEntries"]]};
    const GDILPEN : JBSObjects = {props : [["lopnStyle"], ["lopnWidth"], ["lopnColor"]]};
    const GDILBRUSH : JBSObjects = {props : [["lbStyle"], ["lbColor"], ["lbHatch"]]};
    const GDILFONT : JBSObjects = {props : [["lfHeight"],  ["lfWidth"],  ["lfEscapement"],  ["lfOrientation"],  ["lfWeight"],  ["lfItalic"],  ["lfUnderline"],  ["lfStrikeOut"],  ["lfCharSet"],  ["lfOutPrecision"],  ["lfClipPrecision"],  ["lfQuality"],  ["lfPitchAndFamily"],  ["lfFaceName"]]};

    const LayeredWindowAttribObj : JBSObjects = {props: [["transparencyColor"], ["alpha"], ["dwFlags"]]};
    const TransformObject : JBSObjects = {props: [["eM11"],  ["eM12"],  ["eM21"],  ["eM22"],  ["eDx"],  ["eDy"]]};

    const DIBSection : JBSObjects = {props : [["bitmap"], ["_bits"], ["SetBit", vscode.CompletionItemKind.Method], ["GetBit", vscode.CompletionItemKind.Method], ["GetBits", vscode.CompletionItemKind.Method], ["SetBits", vscode.CompletionItemKind.Method], ["bitCount"], ["width"], ["height"]]};

    const MEMINFOOBJECT : JBSObjects = {props : [["cb"],["PageFaultCount"],["PeakWorkingSetSize"],["WorkingSetSize"],["QuotaPeakPagedPoolUsage"],["QuotaPagedPoolUsage"],["QuotaPeakNonPagedPoolUsage"],["QuotaNonPagedPoolUsage"],["PagefileUsage"],["PeakPagefileUsage"],["PrivateUsage"],]};

    const TPID : JBSObjects = {props : [["processID"], ["thread"]]};

    const MSEX : JBSObjects = {props : [["dwLength"], ["dwMemoryLoad"], ["ullTotalPhys"], ["ullAvailPhys"], ["ullTotalPageFile"], ["ullAvailPageFile"], ["ullTotalVirtual"], ["ullAvailVirtual"], ["ullAvailExtendedVirtual"], ]};

	const objectReturningFunctions:Array<[string, JBSObjects]> = [
        ["createCanvas", CanvasObject],
        ["GetWindowRect", RectObject],
        ["GetClientRect", RectObject],
        ["CreateWindowClass", WindowClassObject],
        ["GetMousePos", PointObject],
        ["GetCursorPos", PointObject],
        ["require", RequireObject],
        ["BeginPaint", PaintStruct],
        ["CreateSolidColorBrush", SolidColorBrushObject],
        ["CreateGradientStopCollection", IUnknownObject],
        ["CreateLinearGradientBrush", LinearGradientBrushObject],
        ["CreateRadialGradientBrush", RadialGradientBrushObject],
        ["CreateFont", FontObject],
        ["CreateTextLayout", TextLayoutObject],
        ["CreateBitmap", BitmapObject],
        ["CreateBitmapFromWicBitmap", BitmapObject],
        ["CreateBitmapBrush", BitmapBrushObject],
        ["GetLineSpacing", LineSpacingObject],
        ["GetTrimming", TrimmingObject],
        ["GetPixel", RGBObject],
        ["SetPixel", RGBObject],
        ["GetIconDimensions", SIZEObject],
        ["MAKEPOINTS", PointObject],
        ["GetBitmapDimensions", SIZEObject],
        ["GetObjectHBITMAP", GDIHBITMAP],
        ["GetObjectDIBITMAP", GDIHBITMAP],
        ["GetObjectExtHPEN", GDIExtLPEN],
        ["GetObjectHPEN", GDILPEN],
        ["GetObjectHBRUSH", GDILBRUSH],
        ["GetObjectHFONT", GDILFONT],
        ["GetLayeredWindowAttributes", LayeredWindowAttribObj],
        ["GetWorldTransform", TransformObject],
        ["CreateDIBSection", DIBSection],
        ["InitializeWIC", WICObject],
        ["LoadBitmapFromFilename", WICBitmap],
        //["LoadBitmapFromStream", WICBitmap],
        ["GetThumbnail", WICBitmap],
        ["GetPreview", WICBitmap],
        ["GetBitmapFrame", WICBitmap],
        ["LoadDecoder", WICDecoder],
        ["GetProcessMemoryInfo", MEMINFOOBJECT],
        ["GetWindowThreadProcessId", TPID],
        ["GlobalMemoryStatusEx", MSEX],
    ];

    const createCanvasSpecial:Array<[string, string, JBSObjects]> = [
        ["d2d", "ID2D1RenderTarget", CanvasObject],
        ["d2d", "ID2D1DCRenderTarget", CanvasObject],
        ["d2d", "ID2D1DeviceContext", CanvasObject11],
        ["d2d", "ID2D1DeviceContextDComposition", CanvasObject11DComp],
        ["gl", "", GLObject],
    ];
	
	let definedObjects:Array<JBSObject> = [];

    //class BrushObject implements JBSObjects {
    //    props: [["shit", vscode.CompletionItemKind.Method]];
    //}

    function calcDefinedObjects(document : vscode.TextDocument) {
        definedObjects = [];
        for(let i = 0; i < document.lineCount; i++) {
            for(const orf of objectReturningFunctions) {
                //const line = document.lineAt(i).text.replaceAll("   ", "");
                if(/*line*/document.lineAt(i).text.includes(orf[0]+"(")) {
                    //console.log(line.substring(line.indexOf(" ")+1, line.indexOf(" =")), orf[0], "line",i);
                    //definedObjects.push({varName: line.substring(line.indexOf(" ")+1, line.indexOf(" =")), object: orf[1]});
                    let tline = document.lineAt(i).text.replaceAll("    ", "");
                    //const line = document.lineAt(i).text.replaceAll("   ", "");
                    //if(tline.substring(0, 6) == "const ") {
                    //    tline = tline.replace("const ", "");
                    //}else if(tline.substring(0,4) == "var ") {
                    //    tline = tline.replace("var ", "");
                    //}else if(tline.substring(0,4) == "let ") {
                    //    tline = tline.replace("let ", "");
                    //}
                    tline = tline.replace("const ", "").replace("var ", "").replace("let ", "");
                    //console.log(tline.substring(0, tline.indexOf(" =")), orf[0], "line",i);
                    definedObjects.push({varName: tline.substring(0, tline.indexOf(" =")), object: orf[1]});
                }
            }
        }
        //console.log(definedObjects);
    }

	const signatureHelp = vscode.languages.registerSignatureHelpProvider('javascript', {
		provideSignatureHelp(document : vscode.TextDocument, position : vscode.Position, token : vscode.CancellationToken, sigcontext : vscode.SignatureHelpContext) {
			const line = document.lineAt(position).text;
            calcDefinedObjects(document);
			//if(!line.substring(0, line.indexOf("(")).includes(".")) 
			for(const object of definedObjects) {
				if(line.includes(object.varName)) {
					for(const method of object.object.props) {
						if(line.includes(method[0]+"(")) {
							const func = objectFunctions[method[0]];
							const param = (line.slice(0, position.character).match(/,/g) || []).length;
							const sig = new vscode.SignatureInformation("", new vscode.MarkdownString(func.desc));//func.info, "typescript"));
							sig.parameters = [
								new vscode.ParameterInformation(func.args[param], new vscode.MarkdownString(func.info.replace(func.args[param], "**$&**")))
							];		

							const sighelp = new vscode.SignatureHelp();
							sighelp.signatures = [sig];
							sighelp.activeSignature = 0;
							sighelp.activeParameter = 0;//param;
		
							return sighelp;
						}
						//if(method[1] == vscode.CompletionItemKind.Method && line.includes())
					}
				}
			}
			for(const func of funcs) {
				if(line.includes(func.name+"(")) { //finally getting the correct func LOL!
					const param = (line.slice(0, position.character).match(/,/g) || []).length;
					const sig = new vscode.SignatureInformation("", new vscode.MarkdownString(func.desc));//func.info, "typescript"));
					sig.parameters = [
						new vscode.ParameterInformation(func.args[param], new vscode.MarkdownString(func.info.replace(func.args[param], "**$&**")))
					];
					//for(const str of func.args) {
					//	sig.parameters.push(new vscode.ParameterInformation(str, new vscode.MarkdownString().appendCodeblock(str, "typescript")));
					//}
					//sig.parameters = [
					//	new vscode.ParameterInformation("a", "documentation2"),
					//	new vscode.ParameterInformation("b", "documentation3"),
					//	new vscode.ParameterInformation("c", "documentation4"),
					//];
					
					const sighelp = new vscode.SignatureHelp();
					sighelp.signatures = [sig];
					sighelp.activeSignature = 0;
					sighelp.activeParameter = 0;//param;
		
					return sighelp;
					//break;
				}
			}
		},
	});

	const hover = vscode.languages.registerHoverProvider('javascript', {
		provideHover(document : vscode.TextDocument, position : vscode.Position, token : vscode.CancellationToken) {
			//let string = "nuh uh";
            calcDefinedObjects(document);
			if(document.getWordRangeAtPosition(position) != undefined) {
				const shit : vscode.Range = document.getWordRangeAtPosition(position) as vscode.Range;
				const line = document.lineAt(position).text;
				const object = line.substring(shit.start.character, shit.end.character);
				let string = "sus";
				let additional = "\n";

				const markdown = new vscode.MarkdownString();
				//const addmarkdown = new vscode.MarkdownString();
				//const defs = [];
                console.log(object, line[shit.end.character], "\x07");
				if(line[shit.end.character] == "(") {
                    let quit = false;
                    for(const dObject of definedObjects) {
                        if(line.includes(dObject.varName) && !quit) {
                            console.log(line, dObject.varName);
                            for(const method of dObject.object.props) {
                                if(object == method[0] && line.includes(method[0])) { //lets go EndPaint(hwnd, ps) has hover AND signature
                                    console.log("quitting", method[0]);
                                    const func = objectFunctions[method[0]];
                                    string = func.info;
                                    additional += func.desc;
                                    quit = true;
                                    //console.log(object.varName, string, additional);
                                    break;
                                }
                            }
                        }
                    }       
                    if(!quit) { 
                        for(const func of funcs) {
                            if(object.includes(func.name) && line.includes(func.name+"(")) {//func.name.includes(object)) {
                                string = func.info;
                                additional += func.desc;
                                break;
                            }
                        }
                    }
				}//else {
                 //   for(const dObj of definedObjects) {
                 //       if(dObj.varName == object) {
                 //           string = //uhhhh definedObjects don't hold the name of their creator function :sob:
                 //       }
                 //   }
                //}

                //console.log(string, additional);

				markdown.appendCodeblock(string, "typescript");//"print(...) : void", "javascript");
				markdown.appendMarkdown(additional);
				//defs.push(new vscode.Hover(markdown), new vscode.Hover(addmarkdown));
				const def = new vscode.Hover(markdown);
				return def;
			}
		},
	});

	const provider1 = vscode.languages.registerCompletionItemProvider('javascript', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			// a simple completion item which inserts `Hello World!`
			//const simpleCompletion = new vscode.CompletionItem('Hello World!');

			// a completion item that inserts its text as snippet,
			// the `insertText`-property is a `SnippetString` which will be
			// honored by the editor.
			//const snippetCompletion = new vscode.CompletionItem('Good part of the day');
			//snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
			//const docs: any = new vscode.MarkdownString("Inserts a snippet that lets you select [link](x.ts).");
			//snippetCompletion.documentation = docs;
			//docs.baseUri = vscode.Uri.parse('http://example.com/a/b/c/');

			// a completion item that can be accepted by a commit character,
			// the `commitCharacters`-property is set which means that the completion will
			// be inserted and then the character will be typed.
			//const commitCharacterCompletion = new vscode.CompletionItem('console', vscode.CompletionItemKind.Variable);
			//commitCharacterCompletion.commitCharacters = ['.'];
			//commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `consoele.`');
			
			const completions:vscode.CompletionItem[] = [];

			for(const func of funcs) {
				const completion = new vscode.CompletionItem(func.name, func.type);//vscode.CompletionItemKind.Function);
				//completion.commitCharacters = ['.'];
				completion.detail = func.info;
				completions.push(completion);
			}

			for(const object of objects) {
				const completion = new vscode.CompletionItem(object.name, object.type);//vscode.CompletionItemKind.Function);
				//completion.commitCharacters = ['.'];
				completion.detail = object.info;
				completions.push(completion);
			}

			for(const macro of macros) {
				const completion = new vscode.CompletionItem(macro, vscode.CompletionItemKind.Constant);
				completions.push(completion);
			}

			//const commitCharacterCompletion = new vscode.CompletionItem("print", vscode.CompletionItemKind.Method);
			//commitCharacterCompletion.commitCharacters = ['.'];
			//commitCharacterCompletion.documentation = new vscode.MarkdownString("prints an object provided");
			//commitCharacterCompletion.detail = "siniegr";

			// a completion item that retriggers IntelliSense when being accepted,
			// the `command`-property is set which the editor will execute after 
			// completion has been inserted. Also, the `insertText` is set so that 
			// a space is inserted after `new`
			const commandCompletion = new vscode.CompletionItem('new');
			commandCompletion.kind = vscode.CompletionItemKind.Keyword;
			commandCompletion.insertText = 'new ';
			commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

			completions.push(commandCompletion);

			// return all completion items as array
			return completions;
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'javascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				calcDefinedObjects(document);
				const linePrefix = document.lineAt(position).text.slice(0, position.character);
				for(const object of definedObjects) {
					if(linePrefix.endsWith(object.varName+".")) {
						const shit = [];
						for(const prop of object.object.props) {
							shit.push(new vscode.CompletionItem(prop[0], prop[1] || vscode.CompletionItemKind.Field));
						}
						return shit;
					}
					//break;
				}
				return undefined;
				//if (!linePrefix.endsWith('console.')) {
				//	return undefined;
				//}
//
				//return [
				//	new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
				//	new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
				//	new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
				//];
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(provider1, provider2, signatureHelp);
}

//at some point i should run a loop through jbs to find the values of all of these and use some string stuff to convert it all to a list and just add it to macros so i can do macros[i] for the name and macros[i+1] for the value like
//"IDOK", 2 (or whatever)
const macros:string[] = [
    "IDOK",
    "IDCANCEL",
    "IDABORT",
    "IDRETRY",
    "IDIGNORE",
    "IDYES",
    "IDNO",
    "IDTRYAGAIN",
    "IDCONTINUE",
    "MB_OK",
    "MB_OKCANCEL",
    "MB_ABORTRETRYIGNORE",
    "MB_YESNOCANCEL",
    "MB_YESNO",
    "MB_RETRYCANCEL",
    "MB_CANCELTRYCONTINUE",
    "MB_ICONERROR",
    "MB_ICONQUESTION",
    "MB_ICONEXCLAMATION",
    "MB_ICONINFORMATION",
    "MB_DEFBUTTON1",
    "MB_DEFBUTTON2",
    "MB_DEFBUTTON3",
    "MB_DEFBUTTON4",
    "MB_APPLMODAL",
    "MB_SYSTEMMODAL",
    "MB_TASKMODAL",
    "MB_SERVICE_NOTIFICATION",
    "MB_RIGHT",
    "MB_RTLREADING",
    "MB_SETFOREGROUND",
    "MB_TOPMOST",
    "WM_NULL",
    "WM_CREATE",
    "WM_DESTROY",
    "WM_MOVE",
    "WM_SIZE",
    "WM_ACTIVATE",
    "WM_SETFOCUS",
    "WM_KILLFOCUS",
    "WM_ENABLE",
    "WM_SETREDRAW",
    "WM_SETTEXT",
    "WM_GETTEXT",
    "WM_GETTEXTLENGTH",
    "WM_PAINT",
    "WM_CLOSE",
    "WM_QUERYENDSESSION",
    "WM_QUIT",
    "WM_QUERYOPEN",
    "WM_ERASEBKGND",
    "WM_SYSCOLORCHANGE",
    "WM_ENDSESSION",
    "WM_SHOWWINDOW",
    "WM_WININICHANGE",
    "WM_DEVMODECHANGE",
    "WM_ACTIVATEAPP",
    "WM_FONTCHANGE",
    "WM_TIMECHANGE",
    "WM_CANCELMODE",
    "WM_SETCURSOR",
    "WM_MOUSEACTIVATE",
    "WM_CHILDACTIVATE",
    "WM_QUEUESYNC",
    "WM_GETMINMAXINFO",
    "WM_PAINTICON",
    "WM_ICONERASEBKGND",
    "WM_NEXTDLGCTL",
    "WM_SPOOLERSTATUS",
    "WM_DRAWITEM",
    "WM_MEASUREITEM",
    "WM_DELETEITEM",
    "WM_VKEYTOITEM",
    "WM_CHARTOITEM",
    "WM_SETFONT",
    "WM_GETFONT",
    "WM_SETHOTKEY",
    "WM_GETHOTKEY",
    "WM_QUERYDRAGICON",
    "WM_COMPAREITEM",
    "WM_GETOBJECT",
    "WM_COMPACTING",
    "WM_COMMNOTIFY",
    "WM_WINDOWPOSCHANGING",
    "WM_WINDOWPOSCHANGED",
    "WM_POWER",
    "WM_COPYDATA",
    "WM_CANCELJOURNAL",
    "WM_NOTIFY",
    "WM_INPUTLANGCHANGEREQUEST",
    "WM_INPUTLANGCHANGE",
    "WM_TCARD",
    "WM_HELP",
    "WM_USERCHANGED",
    "WM_NOTIFYFORMAT",
    "WM_CONTEXTMENU",
    "WM_STYLECHANGING",
    "WM_STYLECHANGED",
    "WM_DISPLAYCHANGE",
    "WM_GETICON",
    "WM_SETICON",
    "WM_NCCREATE",
    "WM_NCDESTROY",
    "WM_NCCALCSIZE",
    "WM_NCHITTEST",
    "WM_NCPAINT",
    "WM_NCACTIVATE",
    "WM_GETDLGCODE",
    "WM_SYNCPAINT",
    "WM_NCMOUSEMOVE",
    "WM_NCLBUTTONDOWN",
    "WM_NCLBUTTONUP",
    "WM_NCLBUTTONDBLCLK",
    "WM_NCRBUTTONDOWN",
    "WM_NCRBUTTONUP",
    "WM_NCRBUTTONDBLCLK",
    "WM_NCMBUTTONDOWN",
    "WM_NCMBUTTONUP",
    "WM_NCMBUTTONDBLCLK",
    "WM_NCXBUTTONDOWN",
    "WM_NCXBUTTONUP",
    "WM_NCXBUTTONDBLCLK",
    "WM_INPUT",
    "WM_KEYDOWN",
    "WM_KEYFIRST",
    "WM_KEYUP",
    "WM_CHAR",
    "WM_DEADCHAR",
    "WM_SYSKEYDOWN",
    "WM_SYSKEYUP",
    "WM_SYSCHAR",
    "WM_SYSDEADCHAR",
    "WM_UNICHAR",
    "WM_KEYLAST",
    "WM_IME_STARTCOMPOSITION",
    "WM_IME_ENDCOMPOSITION",
    "WM_IME_COMPOSITION",
    "WM_IME_KEYLAST",
    "WM_INITDIALOG",
    "WM_COMMAND",
    "WM_SYSCOMMAND",
    "WM_TIMER",
    "WM_HSCROLL",
    "WM_VSCROLL",
    "WM_INITMENU",
    "WM_INITMENUPOPUP",
    "WM_MENUSELECT",
    "WM_MENUCHAR",
    "WM_ENTERIDLE",
    "WM_MENURBUTTONUP",
    "WM_MENUDRAG",
    "WM_MENUGETOBJECT",
    "WM_UNINITMENUPOPUP",
    "WM_MENUCOMMAND",
    "WM_CHANGEUISTATE",
    "WM_UPDATEUISTATE",
    "WM_QUERYUISTATE",
    "WM_CTLCOLORMSGBOX",
    "WM_CTLCOLOREDIT",
    "WM_CTLCOLORLISTBOX",
    "WM_CTLCOLORBTN",
    "WM_CTLCOLORDLG",
    "WM_CTLCOLORSCROLLBAR",
    "WM_CTLCOLORSTATIC",
    "WM_MOUSEFIRST",
    "WM_MOUSEMOVE",
    "WM_LBUTTONDOWN",
    "WM_LBUTTONUP",
    "WM_LBUTTONDBLCLK",
    "WM_RBUTTONDOWN",
    "WM_RBUTTONUP",
    "WM_RBUTTONDBLCLK",
    "WM_MBUTTONDOWN",
    "WM_MBUTTONUP",
    "WM_MBUTTONDBLCLK",
    "WM_MOUSELAST",
    "WM_MOUSEWHEEL",
    "WM_XBUTTONDOWN",
    "WM_XBUTTONUP",
    "WM_XBUTTONDBLCLK",
    "WM_MOUSEHWHEEL",
    "WM_PARENTNOTIFY",
    "WM_ENTERMENULOOP",
    "WM_EXITMENULOOP",
    "WM_NEXTMENU",
    "WM_SIZING",
    "WM_CAPTURECHANGED",
    "WM_MOVING",
    "WM_POWERBROADCAST",
    "WM_DEVICECHANGE",
    "WM_MDICREATE",
    "WM_MDIDESTROY",
    "WM_MDIACTIVATE",
    "WM_MDIRESTORE",
    "WM_MDINEXT",
    "WM_MDIMAXIMIZE",
    "WM_MDITILE",
    "WM_MDICASCADE",
    "WM_MDIICONARRANGE",
    "WM_MDIGETACTIVE",
    "WM_MDISETMENU",
    "WM_ENTERSIZEMOVE",
    "WM_EXITSIZEMOVE",
    "WM_DROPFILES",
    "WM_MDIREFRESHMENU",
    "WM_IME_SETCONTEXT",
    "WM_IME_NOTIFY",
    "WM_IME_CONTROL",
    "WM_IME_COMPOSITIONFULL",
    "WM_IME_SELECT",
    "WM_IME_CHAR",
    "WM_IME_REQUEST",
    "WM_IME_KEYDOWN",
    "WM_IME_KEYUP",
    "WM_NCMOUSEHOVER",
    "WM_MOUSEHOVER",
    "WM_NCMOUSELEAVE",
    "WM_MOUSELEAVE",
    "WM_CUT",
    "WM_COPY",
    "WM_PASTE",
    "WM_CLEAR",
    "WM_UNDO",
    "WM_RENDERFORMAT",
    "WM_RENDERALLFORMATS",
    "WM_DESTROYCLIPBOARD",
    "WM_DRAWCLIPBOARD",
    "WM_PAINTCLIPBOARD",
    "WM_VSCROLLCLIPBOARD",
    "WM_SIZECLIPBOARD",
    "WM_ASKCBFORMATNAME",
    "WM_CHANGECBCHAIN",
    "WM_HSCROLLCLIPBOARD",
    "WM_QUERYNEWPALETTE",
    "WM_PALETTEISCHANGING",
    "WM_PALETTECHANGED",
    "WM_HOTKEY",
    "WM_PRINT",
    "WM_PRINTCLIENT",
    "WM_APPCOMMAND",
    "WM_HANDHELDFIRST",
    "WM_HANDHELDLAST",
    "WM_AFXFIRST",
    "WM_AFXLAST",
    "WM_PENWINFIRST",
    "WM_PENWINLAST",
    "WM_PSD_PAGESETUPDLG",
    "WM_USER",
    "WM_CHOOSEFONT_GETLOGFONT",
    "WM_PSD_FULLPAGERECT",
    "WM_PSD_MINMARGINRECT",
    "WM_PSD_MARGINRECT",
    "WM_PSD_GREEKTEXTRECT",
    "WM_PSD_ENVSTAMPRECT",
    "WM_PSD_YAFULLPAGERECT",
    "WM_CHOOSEFONT_SETLOGFONT",
    "WM_CHOOSEFONT_SETFLAGS",
    "SRCAND",
    "SRCCOPY",
    "SRCERASE",
    "SRCINVERT",
    "SRCPAINT",
    "NOTSRCCOPY",
    "NOTSRCERASE",
    "VK_LBUTTON",
    "VK_RBUTTON",
    "VK_CANCEL",
    "VK_MBUTTON",
    "VK_XBUTTON1",
    "VK_XBUTTON2",
    "VK_BACK",
    "VK_TAB",
    "VK_CLEAR",
    "VK_RETURN",
    "VK_SHIFT",
    "VK_CONTROL",
    "VK_MENU",
    "VK_PAUSE",
    "VK_CAPITAL",
    "VK_KANA",
    "VK_HANGUL",
    "VK_IME_ON",
    "VK_JUNJA",
    "VK_FINAL",
    "VK_HANJA",
    "VK_KANJI",
    "VK_IME_OFF",
    "VK_ESCAPE",
    "VK_CONVERT",
    "VK_NONCONVERT",
    "VK_ACCEPT",
    "VK_MODECHANGE",
    "VK_SPACE",
    "VK_PRIOR",
    "VK_NEXT",
    "VK_END",
    "VK_HOME",
    "VK_LEFT",
    "VK_UP",
    "VK_RIGHT",
    "VK_DOWN",
    "VK_SELECT",
    "VK_PRINT",
    "VK_EXECUTE",
    "VK_SNAPSHOT",
    "VK_INSERT",
    "VK_DELETE",
    "VK_HELP",
    "VK_LWIN",
    "VK_RWIN",
    "VK_APPS",
    "VK_SLEEP",
    "VK_NUMPAD0",
    "VK_NUMPAD1",
    "VK_NUMPAD2",
    "VK_NUMPAD3",
    "VK_NUMPAD4",
    "VK_NUMPAD5",
    "VK_NUMPAD6",
    "VK_NUMPAD7",
    "VK_NUMPAD8",
    "VK_NUMPAD9",
    "VK_MULTIPLY",
    "VK_ADD",
    "VK_SEPARATOR",
    "VK_SUBTRACT",
    "VK_DECIMAL",
    "VK_DIVIDE",
    "VK_F1",
    "VK_F2",
    "VK_F3",
    "VK_F4",
    "VK_F5",
    "VK_F6",
    "VK_F7",
    "VK_F8",
    "VK_F9",
    "VK_F10",
    "VK_F11",
    "VK_F12",
    "VK_F13",
    "VK_F14",
    "VK_F15",
    "VK_F16",
    "VK_F17",
    "VK_F18",
    "VK_F19",
    "VK_F20",
    "VK_F21",
    "VK_F22",
    "VK_F23",
    "VK_F24",
    "VK_NUMLOCK",
    "VK_SCROLL",
    "VK_LSHIFT",
    "VK_RSHIFT",
    "VK_LCONTROL",
    "VK_RCONTROL",
    "VK_LMENU",
    "VK_RMENU",
    "VK_BROWSER_BACK",
    "VK_BROWSER_FORWARD",
    "VK_BROWSER_REFRESH",
    "VK_BROWSER_STOP",
    "VK_BROWSER_SEARCH",
    "VK_BROWSER_FAVORITES",
    "VK_BROWSER_HOME",
    "VK_VOLUME_MUTE",
    "VK_VOLUME_DOWN",
    "VK_VOLUME_UP",
    "VK_MEDIA_NEXT_TRACK",
    "VK_MEDIA_PREV_TRACK",
    "VK_MEDIA_STOP",
    "VK_MEDIA_PLAY_PAUSE",
    "VK_LAUNCH_MAIL",
    "VK_LAUNCH_MEDIA_SELECT",
    "VK_LAUNCH_APP1",
    "VK_LAUNCH_APP2",
    "VK_OEM_1",
    "VK_OEM_PLUS",
    "VK_OEM_COMMA",
    "VK_OEM_MINUS",
    "VK_OEM_PERIOD",
    "VK_OEM_2",
    "VK_OEM_3",
    "VK_OEM_4",
    "VK_OEM_5",
    "VK_OEM_6",
    "VK_OEM_7",
    "VK_OEM_8",
    "VK_OEM_102",
    "VK_PROCESSKEY",
    "VK_PACKET",
    "VK_ATTN",
    "VK_CRSEL",
    "VK_EXSEL",
    "VK_EREOF",
    "VK_PLAY",
    "VK_ZOOM",
    "VK_NONAME",
    "VK_PA1",
    "VK_OEM_CLEAR",
    "OPAQUE",
    "TRANSPARENT",
    "BS_SOLID",
    "BS_NULL",
    "BS_HOLLOW",
    "BS_HATCHED",
    "BS_PATTERN",
    "BS_INDEXED",
    "BS_DIBPATTERN",
    "BS_DIBPATTERNPT",
    "BS_PATTERN8X8",
    "BS_DIBPATTERN8X8",
    "BS_MONOPATTERN",
    "PS_SOLID",
    "PS_DASH",
    "PS_DOT",
    "PS_DASHDOT",
    "PS_DASHDOTDOT",
    "PS_NULL",
    "PS_INSIDEFRAME",
	"D2D1_EXTEND_MODE_CLAMP",
	"D2D1_EXTEND_MODE_WRAP",
	"D2D1_EXTEND_MODE_MIRROR",
	"D2D1_EXTEND_MODE_FORCE_DWORD",
	"D2D1_BITMAP_INTERPOLATION_MODE_NEAREST_NEIGHBOR",
	"D2D1_BITMAP_INTERPOLATION_MODE_LINEAR",
	"D2D1_BITMAP_INTERPOLATION_MODE_FORCE_DWORD",
	"BLACK_BRUSH",
	"DKGRAY_BRUSH",
	"DC_BRUSH",
	"GRAY_BRUSH",
	"HOLLOW_BRUSH",
	"LTGRAY_BRUSH",
	"NULL_BRUSH",
	"WHITE_BRUSH",
	"BLACK_PEN",
	"DC_PEN",
	"NULL_PEN",
	"WHITE_PEN",
	"ANSI_FIXED_FONT",
	"ANSI_VAR_FONT",
	"DEVICE_DEFAULT_FONT",
	"DEFAULT_GUI_FONT",
	"OEM_FIXED_FONT",
	"SYSTEM_FONT",
	"SYSTEM_FIXED_FONT",
	"DEFAULT_PALETTE",
	"ID2D1RenderTarget",
	"ID2D1DCRenderTarget",
    "ID2D1DeviceContext",
    "ID2D1DeviceContextDComposition",
    "MK_CONTROL",
    "MK_LBUTTON",
    "MK_MBUTTON",
    "MK_RBUTTON",
    "MK_SHIFT",
    "MK_XBUTTON1",
    "MK_XBUTTON2",
    "DWRITE_FLOW_DIRECTION_TOP_TO_BOTTOM",
    "DWRITE_FLOW_DIRECTION_BOTTOM_TO_TOP",
    "DWRITE_FLOW_DIRECTION_LEFT_TO_RIGHT",
    "DWRITE_FLOW_DIRECTION_RIGHT_TO_LEFT",
    "DWRITE_FONT_STRETCH_UNDEFINED",
    "DWRITE_FONT_STRETCH_ULTRA_CONDENSED",
    "DWRITE_FONT_STRETCH_EXTRA_CONDENSED",
    "DWRITE_FONT_STRETCH_CONDENSED",
    "DWRITE_FONT_STRETCH_SEMI_CONDENSED",
    "DWRITE_FONT_STRETCH_NORMAL",
    "DWRITE_FONT_STRETCH_MEDIUM",
    "DWRITE_FONT_STRETCH_SEMI_EXPANDED",
    "DWRITE_FONT_STRETCH_EXPANDED",
    "DWRITE_FONT_STRETCH_EXTRA_EXPANDED",
    "DWRITE_FONT_STRETCH_ULTRA_EXPANDED",
    "DWRITE_FONT_STYLE_NORMAL",
    "DWRITE_FONT_STYLE_OBLIQUE",
    "DWRITE_FONT_STYLE_ITALIC",
    "DWRITE_FONT_WEIGHT_THIN",
    "DWRITE_FONT_WEIGHT_EXTRA_LIGHT",
    "DWRITE_FONT_WEIGHT_ULTRA_LIGHT",
    "DWRITE_FONT_WEIGHT_LIGHT",
    "DWRITE_FONT_WEIGHT_SEMI_LIGHT",
    "DWRITE_FONT_WEIGHT_NORMAL",
    "DWRITE_FONT_WEIGHT_REGULAR",
    "DWRITE_FONT_WEIGHT_MEDIUM",
    "DWRITE_FONT_WEIGHT_DEMI_BOLD",
    "DWRITE_FONT_WEIGHT_SEMI_BOLD",
    "DWRITE_FONT_WEIGHT_BOLD",
    "DWRITE_FONT_WEIGHT_EXTRA_BOLD",
    "DWRITE_FONT_WEIGHT_ULTRA_BOLD",
    "DWRITE_FONT_WEIGHT_BLACK",
    "DWRITE_FONT_WEIGHT_HEAVY",
    "DWRITE_FONT_WEIGHT_EXTRA_BLACK",
    "DWRITE_FONT_WEIGHT_ULTRA_BLACK",
    "DWRITE_PARAGRAPH_ALIGNMENT_NEAR",
    "DWRITE_PARAGRAPH_ALIGNMENT_FAR",
    "DWRITE_PARAGRAPH_ALIGNMENT_CENTER",
    "DWRITE_READING_DIRECTION_TOP_TO_BOTTOM",
    "DWRITE_READING_DIRECTION_BOTTOM_TO_TOP",
    "DWRITE_READING_DIRECTION_LEFT_TO_RIGHT",
    "DWRITE_READING_DIRECTION_RIGHT_TO_LEFT",
    "DWRITE_TEXT_ALIGNMENT_LEADING",
    "DWRITE_TEXT_ALIGNMENT_TRAILING",
    "DWRITE_TEXT_ALIGNMENT_CENTER",
    "DWRITE_TEXT_ALIGNMENT_JUSTIFIED",
    "DWRITE_WORD_WRAPPING_WRAP",
    "DWRITE_WORD_WRAPPING_NO_WRAP",
    "DWRITE_WORD_WRAPPING_EMERGENCY_BREAK",
    "DWRITE_WORD_WRAPPING_WHOLE_WORD",
    "DWRITE_WORD_WRAPPING_CHARACTER",
    "BLACKONWHITE",
    "COLORONCOLOR",
    "HALFTONE",
    "STRETCH_ANDSCANS",
    "STRETCH_DELETESCANS",
    "STRETCH_HALFTONE",
    "STRETCH_ORSCANS",
    "WHITEONBLACK",
    "PW_CLIENTONLY",
    "PW_RENDERFULLCONTENT",
    "HWND_BOTTOM",
    "HWND_NOTOPMOST",
    "HWND_TOP",
    "HWND_TOPMOST", 
    "SWP_ASYNCWINDOWPOS",
    "SWP_DEFERERASE",
    "SWP_DRAWFRAME",
    "SWP_FRAMECHANGED",
    "SWP_HIDEWINDOW",
    "SWP_NOACTIVATE",
    "SWP_NOCOPYBITS",
    "SWP_NOMOVE",
    "SWP_NOOWNERZORDER",
    "SWP_NOREDRAW",
    "SWP_NOREPOSITION",
    "SWP_NOSENDCHANGING",
    "SWP_NOSIZE",
    "SWP_NOZORDER",
    "SWP_SHOWWINDOW",
    "KEYEVENTF_EXTENDEDKEY",
    "KEYEVENTF_KEYUP",
    "KEYEVENTF_SCANCODE",
    "KEYEVENTF_UNICODE",
    "MOUSEEVENTF_ABSOLUTE",
    "MOUSEEVENTF_LEFTDOWN",
    "MOUSEEVENTF_LEFTUP",
    "MOUSEEVENTF_MIDDLEDOWN",
    "MOUSEEVENTF_MIDDLEUP",
    "MOUSEEVENTF_MOVE",
    "MOUSEEVENTF_RIGHTDOWN",
    "MOUSEEVENTF_RIGHTUP",
    "MOUSEEVENTF_WHEEL",
    "MOUSEEVENTF_XDOWN",
    "MOUSEEVENTF_XUP",
    "MOUSEEVENTF_WHEEL",
    "MOUSEEVENTF_HWHEEL",
    "IDC_ARROW",
    "IDC_IBEAM",
    "IDC_WAIT",
    "IDC_CROSS",
    "IDC_UPARROW",
    "IDC_SIZENWSE",
    "IDC_SIZENESW",
    "IDC_SIZEWE",
    "IDC_SIZENS",
    "IDC_SIZEALL",
    "IDC_NO",
    "IDC_HAND",
    "IDC_APPSTARTING",
    "IDC_HELP",
    "IDC_PIN",
    "IDC_PERSON",
    "IDC_HANDWRITING",
    "NULL",
    "DI_COMPAT",
    "DI_DEFAULTSIZE",
    "DI_IMAGE",
    "DI_MASK",
    "DI_NOMIRROR",
    "DI_NORMAL",
    "IDI_APPLICATION",
    "IDI_ERROR",
    "IDI_QUESTION",
    "IDI_WARNING",
    "IDI_INFORMATION",
    "IDI_WINLOGO",
    "IDI_SHIELD",
    "IMAGE_BITMAP",
    "IMAGE_CURSOR",
    "IMAGE_ICON",
    "LR_CREATEDIBSECTION",
    "LR_DEFAULTCOLOR",
    "LR_DEFAULTSIZE",
    "LR_LOADFROMFILE",
    "LR_LOADMAP3DCOLORS",
    "LR_LOADTRANSPARENT",
    "LR_MONOCHROME",
    "LR_SHARED",
    "LR_VGACOLOR",
    "LR_COPYDELETEORG",
    "LR_COPYFROMRESOURCE",
    "LR_COPYRETURNORG",
    "GCL_CBCLSEXTRA",
    "GCL_CBWNDEXTRA",
    "GCLP_HBRBACKGROUND",
    "GCLP_HCURSOR",
    "GCLP_HICON",
    "GCLP_HICONSM",
    "GCLP_HMODULE",
    "GCLP_MENUNAME",
    "GCL_STYLE",
    "GCLP_WNDPROC",
    "GWL_EXSTYLE",
    "GWLP_HINSTANCE",
    "GWLP_ID",
    "GWL_STYLE",
    "GWLP_USERDATA",
    "GWLP_WNDPROC",
    "DWLP_DLGPROC",
    "DWLP_MSGRESULT",
    "DWLP_USER",
    "DT_BOTTOM",
    "DT_CALCRECT",
    "DT_CENTER",
    "DT_EDITCONTROL",
    "DT_END_ELLIPSIS",
    "DT_EXPANDTABS",
    "DT_EXTERNALLEADING",
    "DT_HIDEPREFIX",
    "DT_INTERNAL",
    "DT_LEFT",
    "DT_MODIFYSTRING",
    "DT_NOCLIP",
    "DT_NOFULLWIDTHCHARBREAK",
    "DT_NOPREFIX",
    "DT_PATH_ELLIPSIS",
    "DT_PREFIXONLY",
    "DT_RIGHT",
    "DT_RTLREADING",
    "DT_SINGLELINE",
    "DT_TABSTOP",
    "DT_TOP",
    "DT_VCENTER",
    "DT_WORDBREAK",
    "DT_WORD_ELLIPSIS",
    "COLOR_ACTIVEBORDER",
    "COLOR_ACTIVECAPTION",
    "COLOR_APPWORKSPACE",
    "COLOR_BACKGROUND",
    "COLOR_BTNFACE",
    "COLOR_BTNSHADOW",
    "COLOR_BTNTEXT",
    "COLOR_CAPTIONTEXT",
    "COLOR_GRAYTEXT",
    "COLOR_HIGHLIGHT",
    "COLOR_HIGHLIGHTTEXT",
    "COLOR_INACTIVEBORDER",
    "COLOR_INACTIVECAPTION",
    "COLOR_MENU",
    "COLOR_MENUTEXT",
    "COLOR_SCROLLBAR",
    "COLOR_WINDOW",
    "COLOR_WINDOWFRAME",
    "COLOR_WINDOWTEXT",
    "WS_BORDER",
    "WS_CAPTION",
    "WS_CHILD",
    "WS_CHILDWINDOW",
    "WS_CLIPCHILDREN",
    "WS_CLIPSIBLINGS",
    "WS_DISABLED",
    "WS_DLGFRAME",
    "WS_GROUP",
    "WS_HSCROLL",
    "WS_ICONIC",
    "WS_MAXIMIZE",
    "WS_MAXIMIZEBOX",
    "WS_MINIMIZE",
    "WS_MINIMIZEBOX",
    "WS_OVERLAPPED",
    "WS_OVERLAPPEDWINDOW",
    "WS_POPUP",
    "WS_POPUPWINDOW",
    "WS_SIZEBOX",
    "WS_SYSMENU",
    "WS_TABSTOP",
    "WS_THICKFRAME",
    "WS_TILED",
    "WS_TILEDWINDOW",
    "WS_VISIBLE",
    "WS_VSCROLL",
    "CS_BYTEALIGNCLIENT",
    "CS_BYTEALIGNWINDOW",
    "CS_CLASSDC",
    "CS_DBLCLKS",
    "CS_DROPSHADOW",
    "CS_GLOBALCLASS",
    "CS_HREDRAW",
    "CS_NOCLOSE",
    "CS_OWNDC",
    "CS_PARENTDC",
    "CS_SAVEBITS",
    "CS_VREDRAW",
    "RDW_ERASE",
    "RDW_FRAME",
    "RDW_INTERNALPAINT",
    "RDW_INVALIDATE",
    "RDW_NOERASE",
    "RDW_NOFRAME",
    "RDW_NOINTERNALPAINT",
    "RDW_VALIDATE",
    "RDW_ERASENOW",
    "RDW_UPDATENOW",
    "RDW_ALLCHILDREN",
    "RDW_NOCHILDREN",
    "R2_BLACK",
    "R2_COPYPEN",
    "R2_MASKNOTPEN",
    "R2_MASKPEN",
    "R2_MASKPENNOT",
    "R2_MERGENOTPEN",
    "R2_MERGEPEN",
    "R2_MERGEPENNOT",
    "R2_NOP",
    "R2_NOT",
    "R2_NOTCOPYPEN",
    "R2_NOTMASKPEN",
    "R2_NOTMERGEPEN",
    "R2_NOTXORPEN",
    "R2_WHITE",
    "R2_XORPEN",
    "SM_ARRANGE",
    "SM_CLEANBOOT",
    "SM_CMONITORS",
    "SM_CMOUSEBUTTONS",
    "SM_CONVERTIBLESLATEMODE",
    "SM_CXBORDER",
    "SM_CXCURSOR",
    "SM_CXDLGFRAME",
    "SM_CXDOUBLECLK",
    "SM_CXDRAG",
    "SM_CXEDGE",
    "SM_CXFIXEDFRAME",
    "SM_CXFOCUSBORDER",
    "SM_CXFRAME",
    "SM_CXFULLSCREEN",
    "SM_CXHSCROLL",
    "SM_CXHTHUMB",
    "SM_CXICON",
    "SM_CXICONSPACING",
    "SM_CXMAXIMIZED",
    "SM_CXMAXTRACK",
    "SM_CXMENUCHECK",
    "SM_CXMENUSIZE",
    "SM_CXMIN",
    "SM_CXMINIMIZED",
    "SM_CXMINSPACING",
    "SM_CXMINTRACK",
    "SM_CXPADDEDBORDER",
    "SM_CXSCREEN",
    "SM_CXSIZE",
    "SM_CXSIZEFRAME",
    "SM_CXSMICON",
    "SM_CXSMSIZE",
    "SM_CXVIRTUALSCREEN",
    "SM_CXVSCROLL",
    "SM_CYBORDER",
    "SM_CYCAPTION",
    "SM_CYCURSOR",
    "SM_CYDLGFRAME",
    "SM_CYDOUBLECLK",
    "SM_CYDRAG",
    "SM_CYEDGE",
    "SM_CYFIXEDFRAME",
    "SM_CYFOCUSBORDER",
    "SM_CYFRAME",
    "SM_CYFULLSCREEN",
    "SM_CYHSCROLL",
    "SM_CYICON",
    "SM_CYICONSPACING",
    "SM_CYKANJIWINDOW",
    "SM_CYMAXIMIZED",
    "SM_CYMAXTRACK",
    "SM_CYMENU",
    "SM_CYMENUCHECK",
    "SM_CYMENUSIZE",
    "SM_CYMIN",
    "SM_CYMINIMIZED",
    "SM_CYMINSPACING",
    "SM_CYMINTRACK",
    "SM_CYSCREEN",
    "SM_CYSIZE",
    "SM_CYSIZEFRAME",
    "SM_CYSMCAPTION",
    "SM_CYSMICON",
    "SM_CYSMSIZE",
    "SM_CYVIRTUALSCREEN",
    "SM_CYVSCROLL",
    "SM_CYVTHUMB",
    "SM_DBCSENABLED",
    "SM_DEBUG",
    "SM_DIGITIZER",
    "SM_IMMENABLED",
    "SM_MAXIMUMTOUCHES",
    "SM_MEDIACENTER",
    "SM_MENUDROPALIGNMENT",
    "SM_MIDEASTENABLED",
    "SM_MOUSEPRESENT",
    "SM_MOUSEHORIZONTALWHEELPRESENT",
    "SM_MOUSEWHEELPRESENT",
    "SM_NETWORK",
    "SM_PENWINDOWS",
    "SM_REMOTECONTROL",
    "SM_REMOTESESSION",
    "SM_SAMEDISPLAYFORMAT",
    "SM_SECURE",
    "SM_SERVERR2",
    "SM_SHOWSOUNDS",
    "SM_SHUTTINGDOWN",
    "SM_SLOWMACHINE",
    "SM_STARTER",
    "SM_SWAPBUTTON",
    "SM_SYSTEMDOCKED",
    "SM_TABLETPC",
    "SM_XVIRTUALSCREEN",
    "SM_YVIRTUALSCREEN",
    "ARW_BOTTOMLEFT",
    "ARW_BOTTOMRIGHT",
    "ARW_TOPLEFT",
    "ARW_TOPRIGHT",
    "ARW_DOWN",
    "ARW_HIDE",
    "ARW_LEFT",
    "ARW_RIGHT",
    "ARW_UP",
    "FW_DONTCARE",
    "FW_THIN",
    "FW_EXTRALIGHT",
    "FW_ULTRALIGHT",
    "FW_LIGHT",
    "FW_NORMAL",
    "FW_REGULAR",
    "FW_MEDIUM",
    "FW_SEMIBOLD",
    "FW_DEMIBOLD",
    "FW_BOLD",
    "FW_EXTRABOLD",
    "FW_ULTRABOLD",
    "FW_HEAVY",
    "FW_BLACK",
    "ANSI_CHARSET",
    "BALTIC_CHARSET",
    "CHINESEBIG5_CHARSET",
    "DEFAULT_CHARSET",
    "EASTEUROPE_CHARSET",
    "GB2312_CHARSET",
    "GREEK_CHARSET",
    "HANGUL_CHARSET",
    "MAC_CHARSET",
    "OEM_CHARSET",
    "RUSSIAN_CHARSET",
    "SHIFTJIS_CHARSET",
    "SYMBOL_CHARSET",
    "TURKISH_CHARSET",
    "VIETNAMESE_CHARSET",
    "JOHAB_CHARSET",
    "ARABIC_CHARSET",
    "HEBREW_CHARSET",
    "THAI_CHARSET",
    "OUT_CHARACTER_PRECIS",
    "OUT_DEFAULT_PRECIS",
    "OUT_DEVICE_PRECIS",
    "OUT_OUTLINE_PRECIS",
    "OUT_PS_ONLY_PRECIS",
    "OUT_RASTER_PRECIS",
    "OUT_STRING_PRECIS",
    "OUT_STROKE_PRECIS",
    "OUT_TT_ONLY_PRECIS",
    "OUT_TT_PRECIS",
    "CLIP_CHARACTER_PRECIS",
    "CLIP_DEFAULT_PRECIS",
    "CLIP_DFA_DISABLE",
    "CLIP_EMBEDDED",
    "CLIP_LH_ANGLES",
    "CLIP_MASK",
    //"CLIP_DFA_OVERRIDE",
    "CLIP_STROKE_PRECIS",
    "CLIP_TT_ALWAYS",
    "ANTIALIASED_QUALITY",
    "CLEARTYPE_QUALITY",
    "DEFAULT_QUALITY",
    "DRAFT_QUALITY",
    "NONANTIALIASED_QUALITY",
    "PROOF_QUALITY",
    "DEFAULT_PITCH",
    "FIXED_PITCH",
    "VARIABLE_PITCH",
    "FF_DECORATIVE",
    "FF_DONTCARE",
    "FF_MODERN",
    "FF_ROMAN",
    "FF_SCRIPT",
    "FF_SWISS",
    "D2D1_ALPHA_MODE_FORCE_DWORD",
    "D2D1_ALPHA_MODE_IGNORE",
    "D2D1_ALPHA_MODE_PREMULTIPLIED",
    "D2D1_ALPHA_MODE_STRAIGHT",
    "D2D1_ALPHA_MODE_UNKNOWN",
    "DXGI_FORMAT_UNKNOWN",
    "DXGI_FORMAT_R32G32B32A32_TYPELESS",
    "DXGI_FORMAT_R32G32B32A32_FLOAT",
    "DXGI_FORMAT_R32G32B32A32_UINT",
    "DXGI_FORMAT_R32G32B32A32_SINT",
    "DXGI_FORMAT_R32G32B32_TYPELESS",
    "DXGI_FORMAT_R32G32B32_FLOAT",
    "DXGI_FORMAT_R32G32B32_UINT",
    "DXGI_FORMAT_R32G32B32_SINT",
    "DXGI_FORMAT_R16G16B16A16_TYPELESS",
    "DXGI_FORMAT_R16G16B16A16_FLOAT",
    "DXGI_FORMAT_R16G16B16A16_UNORM",
    "DXGI_FORMAT_R16G16B16A16_UINT",
    "DXGI_FORMAT_R16G16B16A16_SNORM",
    "DXGI_FORMAT_R16G16B16A16_SINT",
    "DXGI_FORMAT_R32G32_TYPELESS",
    "DXGI_FORMAT_R32G32_FLOAT",
    "DXGI_FORMAT_R32G32_UINT",
    "DXGI_FORMAT_R32G32_SINT",
    "DXGI_FORMAT_R32G8X24_TYPELESS",
    "DXGI_FORMAT_D32_FLOAT_S8X24_UINT",
    "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS",
    "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT",
    "DXGI_FORMAT_R10G10B10A2_TYPELESS",
    "DXGI_FORMAT_R10G10B10A2_UNORM",
    "DXGI_FORMAT_R10G10B10A2_UINT",
    "DXGI_FORMAT_R11G11B10_FLOAT",
    "DXGI_FORMAT_R8G8B8A8_TYPELESS",
    "DXGI_FORMAT_R8G8B8A8_UNORM",
    "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB",
    "DXGI_FORMAT_R8G8B8A8_UINT",
    "DXGI_FORMAT_R8G8B8A8_SNORM",
    "DXGI_FORMAT_R8G8B8A8_SINT",
    "DXGI_FORMAT_R16G16_TYPELESS",
    "DXGI_FORMAT_R16G16_FLOAT",
    "DXGI_FORMAT_R16G16_UNORM",
    "DXGI_FORMAT_R16G16_UINT",
    "DXGI_FORMAT_R16G16_SNORM",
    "DXGI_FORMAT_R16G16_SINT",
    "DXGI_FORMAT_R32_TYPELESS",
    "DXGI_FORMAT_D32_FLOAT",
    "DXGI_FORMAT_R32_FLOAT",
    "DXGI_FORMAT_R32_UINT",
    "DXGI_FORMAT_R32_SINT",
    "DXGI_FORMAT_R24G8_TYPELESS",
    "DXGI_FORMAT_D24_UNORM_S8_UINT",
    "DXGI_FORMAT_R24_UNORM_X8_TYPELESS",
    "DXGI_FORMAT_X24_TYPELESS_G8_UINT",
    "DXGI_FORMAT_R8G8_TYPELESS",
    "DXGI_FORMAT_R8G8_UNORM",
    "DXGI_FORMAT_R8G8_UINT",
    "DXGI_FORMAT_R8G8_SNORM",
    "DXGI_FORMAT_R8G8_SINT",
    "DXGI_FORMAT_R16_TYPELESS",
    "DXGI_FORMAT_R16_FLOAT",
    "DXGI_FORMAT_D16_UNORM",
    "DXGI_FORMAT_R16_UNORM",
    "DXGI_FORMAT_R16_UINT",
    "DXGI_FORMAT_R16_SNORM",
    "DXGI_FORMAT_R16_SINT",
    "DXGI_FORMAT_R8_TYPELESS",
    "DXGI_FORMAT_R8_UNORM",
    "DXGI_FORMAT_R8_UINT",
    "DXGI_FORMAT_R8_SNORM",
    "DXGI_FORMAT_R8_SINT",
    "DXGI_FORMAT_A8_UNORM",
    "DXGI_FORMAT_R1_UNORM",
    "DXGI_FORMAT_R9G9B9E5_SHAREDEXP",
    "DXGI_FORMAT_R8G8_B8G8_UNORM",
    "DXGI_FORMAT_G8R8_G8B8_UNORM",
    "DXGI_FORMAT_BC1_TYPELESS",
    "DXGI_FORMAT_BC1_UNORM",
    "DXGI_FORMAT_BC1_UNORM_SRGB",
    "DXGI_FORMAT_BC2_TYPELESS",
    "DXGI_FORMAT_BC2_UNORM",
    "DXGI_FORMAT_BC2_UNORM_SRGB",
    "DXGI_FORMAT_BC3_TYPELESS",
    "DXGI_FORMAT_BC3_UNORM",
    "DXGI_FORMAT_BC3_UNORM_SRGB",
    "DXGI_FORMAT_BC4_TYPELESS",
    "DXGI_FORMAT_BC4_UNORM",
    "DXGI_FORMAT_BC4_SNORM",
    "DXGI_FORMAT_BC5_TYPELESS",
    "DXGI_FORMAT_BC5_UNORM",
    "DXGI_FORMAT_BC5_SNORM",
    "DXGI_FORMAT_B5G6R5_UNORM",
    "DXGI_FORMAT_B5G5R5A1_UNORM",
    "DXGI_FORMAT_B8G8R8A8_UNORM",
    "DXGI_FORMAT_B8G8R8X8_UNORM",
    "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM",
    "DXGI_FORMAT_B8G8R8A8_TYPELESS",
    "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB",
    "DXGI_FORMAT_B8G8R8X8_TYPELESS",
    "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB",
    "DXGI_FORMAT_BC6H_TYPELESS",
    "DXGI_FORMAT_BC6H_UF16",
    "DXGI_FORMAT_BC6H_SF16",
    "DXGI_FORMAT_BC7_TYPELESS",
    "DXGI_FORMAT_BC7_UNORM",
    "DXGI_FORMAT_BC7_UNORM_SRGB",
    "DXGI_FORMAT_AYUV",
    "DXGI_FORMAT_Y410",
    "DXGI_FORMAT_Y416",
    "DXGI_FORMAT_NV12",
    "DXGI_FORMAT_P010",
    "DXGI_FORMAT_P016",
    "DXGI_FORMAT_420_OPAQUE",
    "DXGI_FORMAT_YUY2",
    "DXGI_FORMAT_Y210",
    "DXGI_FORMAT_Y216",
    "DXGI_FORMAT_NV11",
    "DXGI_FORMAT_AI44",
    "DXGI_FORMAT_IA44",
    "DXGI_FORMAT_P8",
    "DXGI_FORMAT_A8P8",
    "DXGI_FORMAT_B4G4R4A4_UNORM",
    "DXGI_FORMAT_P208",
    "DXGI_FORMAT_V208",
    "DXGI_FORMAT_V408",
    "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE",
    "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE",
    "DXGI_FORMAT_FORCE_UINT",
    "ICON_BIG",
    "ICON_SMALL",
    "BI_RGB",
    "BI_RLE8",
    "BI_RLE4",
    "BI_BITFIELDS",
    "BI_JPEG",
    "BI_PNG",
    "HS_BDIAGONAL",
    "HS_CROSS",
    "HS_DIAGCROSS",
    "HS_FDIAGONAL",
    "HS_HORIZONTAL",
    "HS_VERTICAL",
    "PATCOPY",
    "PATINVERT",
    "DSTINVERT",
    "BLACKNESS",
    "WHITENESS",
    "PATPAINT",
    "MERGEPAINT",
    "MERGECOPY",
    "ES_LEFT",
    "ES_CENTER",
    "ES_RIGHT",
    "ES_MULTILINE",
    "ES_UPPERCASE",
    "ES_LOWERCASE",
    "ES_PASSWORD",
    "ES_AUTOVSCROLL",
    "ES_AUTOHSCROLL",
    "ES_NOHIDESEL",
    "ES_OEMCONVERT",
    "ES_READONLY",
    "ES_WANTRETURN",
    "ES_NUMBER",
    "TPM_LEFTBUTTON",
    "TPM_RIGHTBUTTON",
    "TPM_LEFTALIGN",
    "TPM_CENTERALIGN",
    "TPM_RIGHTALIGN",
    "TPM_TOPALIGN",
    "TPM_VCENTERALIGN",
    "TPM_BOTTOMALIGN",
    "TPM_HORIZONTAL",
    "TPM_VERTICAL",
    "TPM_NONOTIFY",
    "TPM_RETURNCMD",
    "TPM_RECURSE",
    "TPM_HORPOSANIMATION",
    "TPM_HORNEGANIMATION",
    "TPM_VERPOSANIMATION",
    "TPM_VERNEGANIMATION",
    "TPM_NOANIMATION",
    "TPM_LAYOUTRTL",
    "TPM_WORKAREA",
    "ODT_MENU",
    "ODT_LISTBOX",
    "ODT_COMBOBOX",
    "ODT_BUTTON",
    "ODT_STATIC",
    "ODA_DRAWENTIRE",
    "ODA_SELECT",
    "ODA_FOCUS",
    "ODS_SELECTED",
    "ODS_GRAYED",
    "ODS_DISABLED",
    "ODS_CHECKED",
    "ODS_FOCUS",
    "ODS_DEFAULT",
    "ODS_COMBOBOXEDIT",
    "ODS_HOTLIGHT",
    "ODS_INACTIVE",
    "ODS_NOACCEL",
    "ODS_NOFOCUSRECT",
    "MND_CONTINUE",
    "MND_ENDMENU",
    "MNGOF_TOPGAP",
    "MNGOF_BOTTOMGAP",
    "MNGO_NOINTERFACE",
    "MNGO_NOERROR",
    "MIIM_STATE",
    "MIIM_ID",
    "MIIM_SUBMENU",
    "MIIM_CHECKMARKS",
    "MIIM_TYPE",
    "MIIM_DATA",
    "MIIM_STRING",
    "MIIM_BITMAP",
    "MIIM_FTYPE",
    "HBMMENU_CALLBACK",
    "HBMMENU_SYSTEM",
    "HBMMENU_MBAR_RESTORE",
    "HBMMENU_MBAR_MINIMIZE",
    "HBMMENU_MBAR_CLOSE",
    "HBMMENU_MBAR_CLOSE_D",
    "HBMMENU_MBAR_MINIMIZE_D",
    "HBMMENU_POPUP_CLOSE",
    "HBMMENU_POPUP_RESTORE",
    "HBMMENU_POPUP_MAXIMIZE",
    "HBMMENU_POPUP_MINIMIZE",
    "BS_3STATE",
    "BS_AUTO3STATE",
    "BS_AUTOCHECKBOX",
    "BS_AUTORADIOBUTTON",
    "BS_BITMAP",
    "BS_BOTTOM",
    "BS_CENTER",
    "BS_CHECKBOX",
    //"BS_COMMANDLINK",
    //"BS_DEFCOMMANDLINK",
    "BS_DEFPUSHBUTTON",
    //"BS_DEFSPLITBUTTON",
    "BS_GROUPBOX",
    "BS_ICON",
    "BS_FLAT",
    "BS_LEFT",
    "BS_LEFTTEXT",
    "BS_MULTILINE",
    "BS_NOTIFY",
    "BS_OWNERDRAW",
    "BS_PUSHBUTTON",
    "BS_PUSHLIKE",
    "BS_RADIOBUTTON",
    "BS_RIGHT",
    "BS_RIGHTBUTTON",
    //"BS_SPLITBUTTON",
    "BS_TEXT",
    "BS_TOP",
    "BS_TYPEMASK",
    "BS_USERBUTTON",
    "BS_VCENTER",
    //"BCN_HOTITEMCHANGE",
    "BN_CLICKED",
    "BN_DBLCLK",
    "BN_DOUBLECLICKED",
    "BN_DISABLE",
    "BN_PUSHED",
    "BN_HILITE",
    "BN_KILLFOCUS",
    "BN_PAINT",
    "BN_SETFOCUS",
    "BN_UNPUSHED",
    "BN_UNHILITE",
    "SND_APPLICATION",
    "SND_ALIAS",
    "SND_ALIAS_ID",
    "SND_ASYNC",
    "SND_FILENAME",
    "SND_LOOP",
    "SND_MEMORY",
    "SND_NODEFAULT",
    "SND_NOSTOP",
    "SND_NOWAIT",
    "SND_PURGE",
    "SND_RESOURCE",
    "SND_SENTRY",
    "SND_SYNC",
    "SND_SYSTEM",
    "MM_MCINOTIFY",
    "PS_GEOMETRIC",
    "PS_COSMETIC",
    "PS_ENDCAP_ROUND",
    "PS_ENDCAP_SQUARE",
    "PS_ENDCAP_FLAT",
    "PS_JOIN_BEVEL",
    "PS_JOIN_MITER",
    "PS_JOIN_ROUND",
    "PS_USERSTYLE",
    "WS_EX_ACCEPTFILES",
    "WS_EX_APPWINDOW",
    "WS_EX_CLIENTEDGE",
    "WS_EX_COMPOSITED",
    "WS_EX_CONTEXTHELP",
    "WS_EX_CONTROLPARENT",
    "WS_EX_DLGMODALFRAME",
    "WS_EX_LAYERED",
    "WS_EX_LAYOUTRTL",
    "WS_EX_LEFT",
    "WS_EX_LEFTSCROLLBAR",
    "WS_EX_LTRREADING",
    "WS_EX_MDICHILD",
    "WS_EX_NOACTIVATE",
    "WS_EX_NOINHERITLAYOUT",
    "WS_EX_NOPARENTNOTIFY",
    "WS_EX_NOREDIRECTIONBITMAP",
    "WS_EX_OVERLAPPEDWINDOW",
    "WS_EX_PALETTEWINDOW",
    "WS_EX_RIGHT",
    "WS_EX_RIGHTSCROLLBAR",
    "WS_EX_RTLREADING",
    "WS_EX_STATICEDGE",
    "WS_EX_TOOLWINDOW",
    "WS_EX_TOPMOST",
    "WS_EX_TRANSPARENT",
    "WS_EX_WINDOWEDGE",
    "DIB_RGB_COLORS",
    "DIB_PAL_COLORS",
    "LWA_COLORKEY",
    "LWA_ALPHA",
    "GM_ADVANCED",
    "GM_COMPATIBLE",
    "GM_LAST",
    "MM_ANISOTROPIC",
    "MM_HIENGLISH",
    "MM_HIMETRIC",
    "MM_ISOTROPIC",
    "MM_LOENGLISH",
    "MM_LOMETRIC",
    "MM_TEXT",
    "MM_TWIPS",
    "MWT_IDENTITY",
    "MWT_LEFTMULTIPLY",
    "MWT_RIGHTMULTIPLY",
    "AW_ACTIVATE",
    "AW_BLEND",
    "AW_CENTER",
    "AW_HIDE",
    "AW_HOR_POSITIVE",
    "AW_HOR_NEGATIVE",
    "AW_SLIDE",
    "AW_VER_POSITIVE",
    "AW_VER_NEGATIVE",
    "ULW_ALPHA",
    "ULW_COLORKEY",
    "ULW_OPAQUE",
    "ULW_EX_NORESIZE",
    "AC_SRC_ALPHA",
    "AC_SRC_OVER",
    "DWM_BB_BLURREGION",
    "DWM_BB_ENABLE",
    "DWM_BB_TRANSITIONONMAXIMIZED",
    "DWMWA_NCRENDERING_ENABLED",
    "DWMWA_NCRENDERING_POLICY",
    "DWMWA_TRANSITIONS_FORCEDISABLED",
    "DWMWA_ALLOW_NCPAINT",
    "DWMWA_CAPTION_BUTTON_BOUNDS",
    "DWMWA_NONCLIENT_RTL_LAYOUT",
    "DWMWA_FORCE_ICONIC_REPRESENTATION",
    "DWMWA_FLIP3D_POLICY",
    "DWMWA_EXTENDED_FRAME_BOUNDS",
    "DWMWA_HAS_ICONIC_BITMAP",
    "DWMWA_DISALLOW_PEEK",
    "DWMWA_EXCLUDED_FROM_PEEK",            
    "DWMWA_CLOAK",
    "DWMWA_CLOAKED",
    "DWMWA_FREEZE_REPRESENTATION",
    "DWMWA_PASSIVE_UPDATE_MODE",
    "DWMWA_USE_HOSTBACKDROPBRUSH",
    "DWMWA_USE_IMMERSIVE_DARK_MODE",
    "DWMWA_WINDOW_CORNER_PREFERENCE",
    "DWMWA_BORDER_COLOR",
    "DWMWA_CAPTION_COLOR",
    "DWMWA_TEXT_COLOR",
    "DWMWA_VISIBLE_FRAME_BORDER_THICKNESS",
    "DWMWA_SYSTEMBACKDROP_TYPE",
    //"DWMWA_LAST",
    "DWMFLIP3D_DEFAULT",     
    "DWMFLIP3D_EXCLUDEBELOW",
    "DWMFLIP3D_EXCLUDEABOVE",
    //"DWMFLIP3D_LAST",
    "DWMWCP_DEFAULT",
    "DWMWCP_DONOTROUND",
    "DWMWCP_ROUND",
    "DWMWCP_ROUNDSMALL",
    "DWMWA_COLOR_NONE",
    "DWMWA_COLOR_DEFAULT",
    "DWMNCRP_USEWINDOWSTYLE",
    "DWMNCRP_DISABLED",
    "DWMNCRP_ENABLED",
    //"DWMNCRP_LAST",
    "DWMSBT_AUTO",
    "DWMSBT_NONE",
    "DWMSBT_MAINWINDOW",
    "DWMSBT_TRANSIENTWINDOW",
    "DWMSBT_TABBEDWINDOW",
    "DCX_WINDOW",
    "DCX_CACHE",
    "DCX_NORESETATTRS",
    "DCX_CLIPCHILDREN",
    "DCX_CLIPSIBLINGS",
    "DCX_PARENTCLIP",
    "DCX_EXCLUDERGN",
    "DCX_INTERSECTRGN",
    "DCX_EXCLUDEUPDATE",
    "DCX_INTERSECTUPDATE",
    "DCX_LOCKWINDOWUPDATE",
    "DCX_VALIDATE",
    "NULLREGION",
    "SIMPLEREGION",
    "COMPLEXREGION",
    "ACCENT_DISABLED",
    "ACCENT_ENABLE_GRADIENT",
    "ACCENT_ENABLE_TRANSPARENTGRADIENT",
    "ACCENT_ENABLE_BLURBEHIND",
    "ACCENT_INVALID_STATE",
    "WM_CLIPBOARDUPDATE",
    "WM_DWMCOMPOSITIONCHANGED",
    "WM_DWMNCRENDERINGCHANGED",
    "WM_DWMCOLORIZATIONCOLORCHANGED",
    "WM_DWMWINDOWMAXIMIZEDCHANGE",
    "WM_DWMSENDICONICTHUMBNAIL",
    "WM_DWMSENDICONICLIVEPREVIEWBITMAP",
    "WM_GETTITLEBARINFOEX",
    "WDA_NONE",
    "WDA_MONITOR",
    "WDA_EXCLUDEFROMCAPTURE",
    "SW_HIDE",
    "SW_SHOWNORMAL",
    "SW_NORMAL",
    "SW_SHOWMINIMIZED",
    "SW_SHOWMAXIMIZED",
    "SW_MAXIMIZE",
    "SW_SHOWNOACTIVATE",
    "SW_SHOW",
    "SW_MINIMIZE",
    "SW_SHOWMINNOACTIVE",
    "SW_SHOWNA",
    "SW_RESTORE",
    "SW_SHOWDEFAULT",
    "SW_FORCEMINIMIZE",
    "SW_MAX",
    "RETURN_CSTRING",
    "RETURN_WSTRING",
    "RETURN_NUMBER",
    "RETURN_FLOAT",
    "RETURN_DOUBLE",
    "RETURN_VOID",
    "VAR_INT",
    "VAR_BOOLEAN",
    "VAR_CSTRING",
    "VAR_WSTRING",
    "VAR_FLOAT", //(sorry bruh (ok now if you have USING_FFI #defined (in JBS3.cpp) you can use floats))
    "VAR_DOUBLE",
    "DONT_RESOLVE_DLL_REFERENCES",
    "LOAD_LIBRARY_AS_DATAFILE",
    //"LOAD_PACKAGED_LIBRARY", //sadly not
    "LOAD_WITH_ALTERED_SEARCH_PATH",
    "LOAD_IGNORE_CODE_AUTHZ_LEVEL",
    "LOAD_LIBRARY_AS_IMAGE_RESOURCE",
    "LOAD_LIBRARY_AS_DATAFILE_EXCLUSIVE",
    "LOAD_LIBRARY_REQUIRE_SIGNED_TARGET",
    "LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR",
    "LOAD_LIBRARY_SEARCH_APPLICATION_DIR",
    "LOAD_LIBRARY_SEARCH_USER_DIRS",
    "LOAD_LIBRARY_SEARCH_SYSTEM32",
    "LOAD_LIBRARY_SEARCH_DEFAULT_DIRS",
    "LOAD_LIBRARY_SAFE_CURRENT_DIRS",
    "LOAD_LIBRARY_SEARCH_SYSTEM32_NO_FORWARDER",
    "LOAD_LIBRARY_OS_INTEGRITY_CONTINUITY",
    "CW_USEDEFAULT",
    "MNC_IGNORE",
    "MNC_CLOSE",
    "MNC_EXECUTE",
    "MNC_SELECT",
    "D2D1_ANTIALIAS_MODE_PER_PRIMITIVE",
    "D2D1_ANTIALIAS_MODE_ALIASED",
    "D2D1_ANTIALIAS_MODE_FORCE_DWORD",
    "GUID_WICPixelFormatDontCare",
    "GUID_WICPixelFormat1bppIndexed",
    "GUID_WICPixelFormat2bppIndexed",
    "GUID_WICPixelFormat4bppIndexed",
    "GUID_WICPixelFormat8bppIndexed",
    "GUID_WICPixelFormatBlackWhite",
    "GUID_WICPixelFormat2bppGray",
    "GUID_WICPixelFormat4bppGray",
    "GUID_WICPixelFormat8bppGray",
    "GUID_WICPixelFormat8bppAlpha",
    "GUID_WICPixelFormat16bppBGR555",
    "GUID_WICPixelFormat16bppBGR565",
    "GUID_WICPixelFormat16bppBGRA5551",
    "GUID_WICPixelFormat16bppGray",
    "GUID_WICPixelFormat24bppBGR",
    "GUID_WICPixelFormat24bppRGB",
    "GUID_WICPixelFormat32bppBGR",
    "GUID_WICPixelFormat32bppBGRA",
    "GUID_WICPixelFormat32bppPBGRA",
    "GUID_WICPixelFormat32bppGrayFloat",
    "GUID_WICPixelFormat32bppRGB",
    "GUID_WICPixelFormat32bppRGBA",
    "GUID_WICPixelFormat32bppPRGBA",
    "GUID_WICPixelFormat48bppRGB",
    "GUID_WICPixelFormat48bppBGR",
    "GUID_WICPixelFormat64bppRGB",
    "GUID_WICPixelFormat64bppRGBA",
    "GUID_WICPixelFormat64bppBGRA",
    "GUID_WICPixelFormat64bppPRGBA",
    "GUID_WICPixelFormat64bppPBGRA",
    "GUID_WICPixelFormat16bppGrayFixedPoint",
    "GUID_WICPixelFormat32bppBGR101010",
    "GUID_WICPixelFormat48bppRGBFixedPoint",
    "GUID_WICPixelFormat48bppBGRFixedPoint",
    "GUID_WICPixelFormat96bppRGBFixedPoint",
    "GUID_WICPixelFormat96bppRGBFloat",
    "GUID_WICPixelFormat128bppRGBAFloat",
    "GUID_WICPixelFormat128bppPRGBAFloat",
    "GUID_WICPixelFormat128bppRGBFloat",
    "GUID_WICPixelFormat32bppCMYK",
    "GUID_WICPixelFormat64bppRGBAFixedPoint",
    "GUID_WICPixelFormat64bppBGRAFixedPoint",
    "GUID_WICPixelFormat64bppRGBFixedPoint",
    "GUID_WICPixelFormat128bppRGBAFixedPoint",
    "GUID_WICPixelFormat128bppRGBFixedPoint",
    "GUID_WICPixelFormat64bppRGBAHalf",
    "GUID_WICPixelFormat64bppPRGBAHalf",
    "GUID_WICPixelFormat64bppRGBHalf",
    "GUID_WICPixelFormat48bppRGBHalf",
    "GUID_WICPixelFormat32bppRGBE",
    "GUID_WICPixelFormat16bppGrayHalf",
    "GUID_WICPixelFormat32bppGrayFixedPoint",
    "GUID_WICPixelFormat32bppRGBA1010102",
    "GUID_WICPixelFormat32bppRGBA1010102XR",
    "GUID_WICPixelFormat32bppR10G10B10A2",
    "GUID_WICPixelFormat32bppR10G10B10A2HDR10",
    "GUID_WICPixelFormat64bppCMYK",
    "GUID_WICPixelFormat24bpp3Channels",
    "GUID_WICPixelFormat32bpp4Channels",
    "GUID_WICPixelFormat40bpp5Channels",
    "GUID_WICPixelFormat48bpp6Channels",
    "GUID_WICPixelFormat56bpp7Channels",
    "GUID_WICPixelFormat64bpp8Channels",
    "GUID_WICPixelFormat48bpp3Channels",
    "GUID_WICPixelFormat64bpp4Channels",
    "GUID_WICPixelFormat80bpp5Channels",
    "GUID_WICPixelFormat96bpp6Channels",
    "GUID_WICPixelFormat112bpp7Channels",
    "GUID_WICPixelFormat128bpp8Channels",
    "GUID_WICPixelFormat40bppCMYKAlpha",
    "GUID_WICPixelFormat80bppCMYKAlpha",
    "GUID_WICPixelFormat32bpp3ChannelsAlpha",
    "GUID_WICPixelFormat40bpp4ChannelsAlpha",
    "GUID_WICPixelFormat48bpp5ChannelsAlpha",
    "GUID_WICPixelFormat56bpp6ChannelsAlpha",
    "GUID_WICPixelFormat64bpp7ChannelsAlpha",
    "GUID_WICPixelFormat72bpp8ChannelsAlpha",
    "GUID_WICPixelFormat64bpp3ChannelsAlpha",
    "GUID_WICPixelFormat80bpp4ChannelsAlpha",
    "GUID_WICPixelFormat96bpp5ChannelsAlpha",
    "GUID_WICPixelFormat112bpp6ChannelsAlpha",
    "GUID_WICPixelFormat128bpp7ChannelsAlpha",
    "GUID_WICPixelFormat144bpp8ChannelsAlpha",
    "GUID_WICPixelFormat8bppY",
    "GUID_WICPixelFormat8bppCb",
    "GUID_WICPixelFormat8bppCr",
    "GUID_WICPixelFormat16bppCbCr",
    "GUID_WICPixelFormat16bppYQuantizedDctCoefficients",
    "GUID_WICPixelFormat16bppCbQuantizedDctCoefficients",
    "GUID_WICPixelFormat16bppCrQuantizedDctCoefficients",
    "GUID_ContainerFormatBmp",
    "GUID_ContainerFormatPng",
    "GUID_ContainerFormatIco",
    "GUID_ContainerFormatJpeg",
    "GUID_ContainerFormatTiff",
    "GUID_ContainerFormatGif",
    "GUID_ContainerFormatWmp",
    "Matrix3x2F",
    "WICBitmapTransformRotate0",
    "WICBitmapTransformRotate90",
    "WICBitmapTransformRotate180",
    "WICBitmapTransformRotate270",
    "WICBitmapTransformFlipHorizontal",
    "WICBitmapTransformFlipVertical",
    "WICBITMAPTRANSFORMOPTIONS_FORCE_DWORD",
    "WICBitmapInterpolationModeNearestNeighbor",
    "WICBitmapInterpolationModeLinear",
    "WICBitmapInterpolationModeCubic",
    "WICBitmapInterpolationModeFant",
    "WICBitmapInterpolationModeHighQualityCubic",
    "WICBITMAPINTERPOLATIONMODE_FORCE_DWORD",
    "WICBitmapUseAlpha",
    "WICBitmapUsePremultipliedAlpha",
    "WICBitmapIgnoreAlpha",
    "WICBITMAPALPHACHANNELOPTIONS_FORCE_DWORD",
    "XINPUT_GAMEPAD_DPAD_UP",
    "XINPUT_GAMEPAD_DPAD_DOWN",
    "XINPUT_GAMEPAD_DPAD_LEFT",
    "XINPUT_GAMEPAD_DPAD_RIGHT",
    "XINPUT_GAMEPAD_START",
    "XINPUT_GAMEPAD_BACK",
    "XINPUT_GAMEPAD_LEFT_THUMB",
    "XINPUT_GAMEPAD_RIGHT_THUMB",
    "XINPUT_GAMEPAD_LEFT_SHOULDER",
    "XINPUT_GAMEPAD_RIGHT_SHOULDER",
    "XINPUT_GAMEPAD_A",
    "XINPUT_GAMEPAD_B",
    "XINPUT_GAMEPAD_X",
    "XINPUT_GAMEPAD_Y",
    "HID_BUFFER_SIZE",
    "CB_OKAY",
    "CB_ERR",
    "CB_ERRSPACE",
    "CBN_ERRSPACE",
    "CBN_SELCHANGE",
    "CBN_DBLCLK",
    "CBN_SETFOCUS",
    "CBN_KILLFOCUS",
    "CBN_EDITCHANGE",
    "CBN_EDITUPDATE",
    "CBN_DROPDOWN",
    "CBN_CLOSEUP",
    "CBN_SELENDOK",
    "CBN_SELENDCANCEL",
    "CBS_SIMPLE",
    "CBS_DROPDOWN",
    "CBS_DROPDOWNLIST",
    "CBS_OWNERDRAWFIXED",
    "CBS_OWNERDRAWVARIABLE",
    "CBS_AUTOHSCROLL",
    "CBS_OEMCONVERT",
    "CBS_SORT",
    "CBS_HASSTRINGS",
    "CBS_NOINTEGRALHEIGHT",
    "CBS_DISABLENOSCROLL",
    "CBS_UPPERCASE",
    "CBS_LOWERCASE",
    "CB_GETEDITSEL",
    "CB_LIMITTEXT",
    "CB_SETEDITSEL",
    "CB_ADDSTRING",
    "CB_DELETESTRING",
    "CB_DIR",
    "CB_GETCOUNT",
    "CB_GETCURSEL",
    "CB_GETLBTEXT",
    "CB_GETLBTEXTLEN",
    "CB_INSERTSTRING",
    "CB_RESETCONTENT",
    "CB_FINDSTRING",
    "CB_SELECTSTRING",
    "CB_SETCURSEL",
    "CB_SHOWDROPDOWN",
    "CB_GETITEMDATA",
    "CB_SETITEMDATA",
    "CB_GETDROPPEDCONTROLRECT",
    "CB_SETITEMHEIGHT",
    "CB_GETITEMHEIGHT",
    "CB_SETEXTENDEDUI",
    "CB_GETEXTENDEDUI",
    "CB_GETDROPPEDSTATE",
    "CB_FINDSTRINGEXACT",
    "CB_SETLOCALE",
    "CB_GETLOCALE",
    "CB_GETTOPINDEX",
    "CB_SETTOPINDEX",
    "CB_GETHORIZONTALEXTENT",
    "CB_SETHORIZONTALEXTENT",
    "CB_GETDROPPEDWIDTH",
    "CB_SETDROPPEDWIDTH",
    "CB_INITSTORAGE",
    "CB_MULTIPLEADDSTRING",
    "CB_GETCOMBOBOXINFO",
    "CB_MSGMAX",
    "SBS_HORZ",
    "SBS_VERT",
    "SBS_TOPALIGN",
    "SBS_LEFTALIGN",
    "SBS_BOTTOMALIGN",
    "SBS_RIGHTALIGN",
    "SBS_SIZEBOXTOPLEFTALIGN",
    "SBS_SIZEBOXBOTTOMRIGHTALIGN",
    "SBS_SIZEBOX",
    "SBS_SIZEGRIP",
    "SBM_SETPOS",
    "SBM_GETPOS",
    "SBM_SETRANGE",
    "SBM_SETRANGEREDRAW",
    "SBM_GETRANGE",
    "SBM_ENABLE_ARROWS",
    "SBM_SETSCROLLINFO",
    "SBM_GETSCROLLINFO",
    "SBM_GETSCROLLBARINFO",
    "SIF_RANGE",
    "SIF_PAGE",
    "SIF_POS",
    "SIF_DISABLENOSCROLL",
    "SIF_TRACKPOS",
    "SIF_ALL",
    "LB_OKAY",
    "LB_ERR",
    "LB_ERRSPACE",
    "LBN_ERRSPACE",
    "LBN_SELCHANGE",
    "LBN_DBLCLK",
    "LBN_SELCANCEL",
    "LBN_SETFOCUS",
    "LBN_KILLFOCUS",
    "LB_ADDSTRING",
    "LB_INSERTSTRING",
    "LB_DELETESTRING",
    "LB_SELITEMRANGEEX",
    "LB_RESETCONTENT",
    "LB_SETSEL",
    "LB_SETCURSEL",
    "LB_GETSEL",
    "LB_GETCURSEL",
    "LB_GETTEXT",
    "LB_GETTEXTLEN",
    "LB_GETCOUNT",
    "LB_SELECTSTRING",
    "LB_DIR",
    "LB_GETTOPINDEX",
    "LB_FINDSTRING",
    "LB_GETSELCOUNT",
    "LB_GETSELITEMS",
    "LB_SETTABSTOPS",
    "LB_GETHORIZONTALEXTENT",
    "LB_SETHORIZONTALEXTENT",
    "LB_SETCOLUMNWIDTH",
    "LB_ADDFILE",
    "LB_SETTOPINDEX",
    "LB_GETITEMRECT",
    "LB_GETITEMDATA",
    "LB_SETITEMDATA",
    "LB_SELITEMRANGE",
    "LB_SETANCHORINDEX",
    "LB_GETANCHORINDEX",
    "LB_SETCARETINDEX",
    "LB_GETCARETINDEX",
    "LB_SETITEMHEIGHT",
    "LB_GETITEMHEIGHT",
    "LB_FINDSTRINGEXACT",
    "LB_SETLOCALE",
    "LB_GETLOCALE",
    "LB_SETCOUNT",
    "LB_INITSTORAGE",
    "LB_ITEMFROMPOINT",
    "LB_GETLISTBOXINFO",
    "LB_MSGMAX",
    "LBS_NOTIFY",
    "LBS_SORT",
    "LBS_NOREDRAW",
    "LBS_MULTIPLESEL",
    "LBS_OWNERDRAWFIXED",
    "LBS_OWNERDRAWVARIABLE",
    "LBS_HASSTRINGS",
    "LBS_USETABSTOPS",
    "LBS_NOINTEGRALHEIGHT",
    "LBS_MULTICOLUMN",
    "LBS_WANTKEYBOARDINPUT",
    "LBS_EXTENDEDSEL",
    "LBS_DISABLENOSCROLL",
    "LBS_NODATA",
    "LBS_NOSEL",
    "LBS_COMBOBOX",
    "LBS_STANDARD",
    "SS_LEFT",
    "SS_CENTER",
    "SS_RIGHT",
    "SS_ICON",
    "SS_BLACKRECT",
    "SS_GRAYRECT",
    "SS_WHITERECT",
    "SS_BLACKFRAME",
    "SS_GRAYFRAME",
    "SS_WHITEFRAME",
    "SS_USERITEM",
    "SS_SIMPLE",
    "SS_LEFTNOWORDWRAP",
    "SS_OWNERDRAW",
    "SS_BITMAP",
    "SS_ENHMETAFILE",
    "SS_ETCHEDHORZ",
    "SS_ETCHEDVERT",
    "SS_ETCHEDFRAME",
    "SS_TYPEMASK",
    "SS_REALSIZECONTROL",
    "SS_NOPREFIX",
    "SS_NOTIFY",
    "SS_CENTERIMAGE",
    "SS_RIGHTJUST",
    "SS_REALSIZEIMAGE",
    "SS_SUNKEN",
    "SS_EDITCONTROL",
    "SS_ENDELLIPSIS",
    "SS_PATHELLIPSIS",
    "SS_WORDELLIPSIS",
    "SS_ELLIPSISMASK",
    "STM_SETICON",
    "STM_GETICON",
    "STM_SETIMAGE",
    "STM_GETIMAGE",
    "STN_CLICKED",
    "STN_DBLCLK",
    "STN_ENABLE",
    "STN_DISABLE",
    "STM_MSGMAX",
    "SB_HORZ",
    "SB_VERT",
    "SB_CTL",
    "SB_BOTH",
    "SB_LINEUP",
    "SB_LINELEFT",
    "SB_LINEDOWN",
    "SB_LINERIGHT",
    "SB_PAGEUP",
    "SB_PAGELEFT",
    "SB_PAGEDOWN",
    "SB_PAGERIGHT",
    "SB_THUMBPOSITION",
    "SB_THUMBTRACK",
    "SB_TOP",
    "SB_LEFT",
    "SB_BOTTOM",
    "SB_RIGHT",
    "SB_ENDSCROLL",
    "D2D1_BORDER_MODE_SOFT",
    "D2D1_BORDER_MODE_HARD",
    "D2D1_BORDER_MODE_FORCE_DWORD",
    "D2D1_CHANNEL_SELECTOR_R",
    "D2D1_CHANNEL_SELECTOR_G",
    "D2D1_CHANNEL_SELECTOR_B",
    "D2D1_CHANNEL_SELECTOR_A",
    "D2D1_CHANNEL_SELECTOR_FORCE_DWORD",
    "D2D1_BITMAPSOURCE_ORIENTATION_DEFAULT",
    "D2D1_BITMAPSOURCE_ORIENTATION_FLIP_HORIZONTAL",
    "D2D1_BITMAPSOURCE_ORIENTATION_ROTATE_CLOCKWISE180",
    "D2D1_BITMAPSOURCE_ORIENTATION_ROTATE_CLOCKWISE180_FLIP_HORIZONTAL",
    "D2D1_BITMAPSOURCE_ORIENTATION_ROTATE_CLOCKWISE270_FLIP_HORIZONTAL",
    "D2D1_BITMAPSOURCE_ORIENTATION_ROTATE_CLOCKWISE90",
    "D2D1_BITMAPSOURCE_ORIENTATION_ROTATE_CLOCKWISE90_FLIP_HORIZONTAL",
    "D2D1_BITMAPSOURCE_ORIENTATION_ROTATE_CLOCKWISE270",
    "D2D1_BITMAPSOURCE_ORIENTATION_FORCE_DWORD",
    "D2D1_GAUSSIANBLUR_PROP_STANDARD_DEVIATION",
    "D2D1_GAUSSIANBLUR_PROP_OPTIMIZATION",
    "D2D1_GAUSSIANBLUR_PROP_BORDER_MODE",
    "D2D1_GAUSSIANBLUR_PROP_FORCE_DWORD",
    "D2D1_GAUSSIANBLUR_OPTIMIZATION_SPEED",
    "D2D1_GAUSSIANBLUR_OPTIMIZATION_BALANCED",
    "D2D1_GAUSSIANBLUR_OPTIMIZATION_QUALITY",
    "D2D1_GAUSSIANBLUR_OPTIMIZATION_FORCE_DWORD",
    "D2D1_DIRECTIONALBLUR_PROP_STANDARD_DEVIATION",
    "D2D1_DIRECTIONALBLUR_PROP_ANGLE",
    "D2D1_DIRECTIONALBLUR_PROP_OPTIMIZATION",
    "D2D1_DIRECTIONALBLUR_PROP_BORDER_MODE",
    "D2D1_DIRECTIONALBLUR_PROP_FORCE_DWORD",
    "D2D1_DIRECTIONALBLUR_OPTIMIZATION_SPEED",
    "D2D1_DIRECTIONALBLUR_OPTIMIZATION_BALANCED",
    "D2D1_DIRECTIONALBLUR_OPTIMIZATION_QUALITY",
    "D2D1_DIRECTIONALBLUR_OPTIMIZATION_FORCE_DWORD",
    "D2D1_SHADOW_PROP_BLUR_STANDARD_DEVIATION",
    "D2D1_SHADOW_PROP_COLOR",
    "D2D1_SHADOW_PROP_OPTIMIZATION",
    "D2D1_SHADOW_PROP_FORCE_DWORD",
    "D2D1_SHADOW_OPTIMIZATION_SPEED",
    "D2D1_SHADOW_OPTIMIZATION_BALANCED",
    "D2D1_SHADOW_OPTIMIZATION_QUALITY",
    "D2D1_SHADOW_OPTIMIZATION_FORCE_DWORD",
    "D2D1_BLEND_PROP_MODE",
    "D2D1_BLEND_PROP_FORCE_DWORD",
    "D2D1_BLEND_MODE_MULTIPLY",
    "D2D1_BLEND_MODE_SCREEN",
    "D2D1_BLEND_MODE_DARKEN",
    "D2D1_BLEND_MODE_LIGHTEN",
    "D2D1_BLEND_MODE_DISSOLVE",
    "D2D1_BLEND_MODE_COLOR_BURN",
    "D2D1_BLEND_MODE_LINEAR_BURN",
    "D2D1_BLEND_MODE_DARKER_COLOR",
    "D2D1_BLEND_MODE_LIGHTER_COLOR",
    "D2D1_BLEND_MODE_COLOR_DODGE",
    "D2D1_BLEND_MODE_LINEAR_DODGE",
    "D2D1_BLEND_MODE_OVERLAY",
    "D2D1_BLEND_MODE_SOFT_LIGHT",
    "D2D1_BLEND_MODE_HARD_LIGHT",
    "D2D1_BLEND_MODE_VIVID_LIGHT",
    "D2D1_BLEND_MODE_LINEAR_LIGHT",
    "D2D1_BLEND_MODE_PIN_LIGHT",
    "D2D1_BLEND_MODE_HARD_MIX",
    "D2D1_BLEND_MODE_DIFFERENCE",
    "D2D1_BLEND_MODE_EXCLUSION",
    "D2D1_BLEND_MODE_HUE",
    "D2D1_BLEND_MODE_SATURATION",
    "D2D1_BLEND_MODE_COLOR",
    "D2D1_BLEND_MODE_LUMINOSITY",
    "D2D1_BLEND_MODE_SUBTRACT",
    "D2D1_BLEND_MODE_DIVISION",
    "D2D1_BLEND_MODE_FORCE_DWORD",
    "D2D1_SATURATION_PROP_SATURATION",
    "D2D1_SATURATION_PROP_FORCE_DWORD",
    "D2D1_HUEROTATION_PROP_ANGLE",
    "D2D1_HUEROTATION_PROP_FORCE_DWORD",
    "D2D1_COLORMATRIX_PROP_COLOR_MATRIX",
    "D2D1_COLORMATRIX_PROP_ALPHA_MODE",
    "D2D1_COLORMATRIX_PROP_CLAMP_OUTPUT",
    "D2D1_COLORMATRIX_PROP_FORCE_DWORD",
    "D2D1_COLORMATRIX_ALPHA_MODE_PREMULTIPLIED",
    "D2D1_COLORMATRIX_ALPHA_MODE_STRAIGHT",
    "D2D1_COLORMATRIX_ALPHA_MODE_FORCE_DWORD",
    "D2D1_BITMAPSOURCE_PROP_WIC_BITMAP_SOURCE",
    "D2D1_BITMAPSOURCE_PROP_SCALE",
    "D2D1_BITMAPSOURCE_PROP_INTERPOLATION_MODE",
    "D2D1_BITMAPSOURCE_PROP_ENABLE_DPI_CORRECTION",
    "D2D1_BITMAPSOURCE_PROP_ALPHA_MODE",
    "D2D1_BITMAPSOURCE_PROP_ORIENTATION",
    "D2D1_BITMAPSOURCE_PROP_FORCE_DWORD",
    "D2D1_BITMAPSOURCE_INTERPOLATION_MODE_NEAREST_NEIGHBOR",
    "D2D1_BITMAPSOURCE_INTERPOLATION_MODE_LINEAR",
    "D2D1_BITMAPSOURCE_INTERPOLATION_MODE_CUBIC",
    "D2D1_BITMAPSOURCE_INTERPOLATION_MODE_FANT",
    "D2D1_BITMAPSOURCE_INTERPOLATION_MODE_MIPMAP_LINEAR",
    "D2D1_BITMAPSOURCE_INTERPOLATION_MODE_FORCE_DWORD",
    "D2D1_BITMAPSOURCE_ALPHA_MODE_PREMULTIPLIED",
    "D2D1_BITMAPSOURCE_ALPHA_MODE_STRAIGHT",
    "D2D1_BITMAPSOURCE_ALPHA_MODE_FORCE_DWORD",
    "D2D1_COMPOSITE_PROP_MODE",
    "D2D1_COMPOSITE_PROP_FORCE_DWORD",
    "D2D1_3DTRANSFORM_PROP_INTERPOLATION_MODE",
    "D2D1_3DTRANSFORM_PROP_BORDER_MODE",
    "D2D1_3DTRANSFORM_PROP_TRANSFORM_MATRIX",
    "D2D1_3DTRANSFORM_PROP_FORCE_DWORD",
    "D2D1_3DTRANSFORM_INTERPOLATION_MODE_NEAREST_NEIGHBOR",
    "D2D1_3DTRANSFORM_INTERPOLATION_MODE_LINEAR",
    "D2D1_3DTRANSFORM_INTERPOLATION_MODE_CUBIC",
    "D2D1_3DTRANSFORM_INTERPOLATION_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_3DTRANSFORM_INTERPOLATION_MODE_ANISOTROPIC",
    "D2D1_3DTRANSFORM_INTERPOLATION_MODE_FORCE_DWORD",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_INTERPOLATION_MODE",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_BORDER_MODE",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_DEPTH",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_PERSPECTIVE_ORIGIN",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_LOCAL_OFFSET",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_GLOBAL_OFFSET",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_ROTATION_ORIGIN",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_ROTATION",
    "D2D1_3DPERSPECTIVETRANSFORM_PROP_FORCE_DWORD",
    "D2D1_3DPERSPECTIVETRANSFORM_INTERPOLATION_MODE_NEAREST_NEIGHBOR",
    "D2D1_3DPERSPECTIVETRANSFORM_INTERPOLATION_MODE_LINEAR",
    "D2D1_3DPERSPECTIVETRANSFORM_INTERPOLATION_MODE_CUBIC",
    "D2D1_3DPERSPECTIVETRANSFORM_INTERPOLATION_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_3DPERSPECTIVETRANSFORM_INTERPOLATION_MODE_ANISOTROPIC",
    "D2D1_3DPERSPECTIVETRANSFORM_INTERPOLATION_MODE_FORCE_DWORD",
    "D2D1_2DAFFINETRANSFORM_PROP_INTERPOLATION_MODE",
    "D2D1_2DAFFINETRANSFORM_PROP_BORDER_MODE",
    "D2D1_2DAFFINETRANSFORM_PROP_TRANSFORM_MATRIX",
    "D2D1_2DAFFINETRANSFORM_PROP_SHARPNESS",
    "D2D1_2DAFFINETRANSFORM_PROP_FORCE_DWORD",
    "D2D1_2DAFFINETRANSFORM_INTERPOLATION_MODE_NEAREST_NEIGHBOR",
    "D2D1_2DAFFINETRANSFORM_INTERPOLATION_MODE_LINEAR",
    "D2D1_2DAFFINETRANSFORM_INTERPOLATION_MODE_CUBIC",
    "D2D1_2DAFFINETRANSFORM_INTERPOLATION_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_2DAFFINETRANSFORM_INTERPOLATION_MODE_ANISOTROPIC",
    "D2D1_2DAFFINETRANSFORM_INTERPOLATION_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_2DAFFINETRANSFORM_INTERPOLATION_MODE_FORCE_DWORD",
    "D2D1_DPICOMPENSATION_PROP_INTERPOLATION_MODE",
    "D2D1_DPICOMPENSATION_PROP_BORDER_MODE",
    "D2D1_DPICOMPENSATION_PROP_INPUT_DPI",
    "D2D1_DPICOMPENSATION_PROP_FORCE_DWORD",
    "D2D1_DPICOMPENSATION_INTERPOLATION_MODE_NEAREST_NEIGHBOR",
    "D2D1_DPICOMPENSATION_INTERPOLATION_MODE_LINEAR",
    "D2D1_DPICOMPENSATION_INTERPOLATION_MODE_CUBIC",
    "D2D1_DPICOMPENSATION_INTERPOLATION_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_DPICOMPENSATION_INTERPOLATION_MODE_ANISOTROPIC",
    "D2D1_DPICOMPENSATION_INTERPOLATION_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_DPICOMPENSATION_INTERPOLATION_MODE_FORCE_DWORD",
    "D2D1_SCALE_PROP_SCALE",
    "D2D1_SCALE_PROP_CENTER_POINT",
    "D2D1_SCALE_PROP_INTERPOLATION_MODE",
    "D2D1_SCALE_PROP_BORDER_MODE",
    "D2D1_SCALE_PROP_SHARPNESS",
    "D2D1_SCALE_PROP_FORCE_DWORD",
    "D2D1_SCALE_INTERPOLATION_MODE_NEAREST_NEIGHBOR",
    "D2D1_SCALE_INTERPOLATION_MODE_LINEAR",
    "D2D1_SCALE_INTERPOLATION_MODE_CUBIC",
    "D2D1_SCALE_INTERPOLATION_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_SCALE_INTERPOLATION_MODE_ANISOTROPIC",
    "D2D1_SCALE_INTERPOLATION_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_SCALE_INTERPOLATION_MODE_FORCE_DWORD",
    "D2D1_TURBULENCE_PROP_OFFSET",
    "D2D1_TURBULENCE_PROP_SIZE",
    "D2D1_TURBULENCE_PROP_BASE_FREQUENCY",
    "D2D1_TURBULENCE_PROP_NUM_OCTAVES",
    "D2D1_TURBULENCE_PROP_SEED",
    "D2D1_TURBULENCE_PROP_NOISE",
    "D2D1_TURBULENCE_PROP_STITCHABLE",
    "D2D1_TURBULENCE_PROP_FORCE_DWORD",
    "D2D1_TURBULENCE_NOISE_FRACTAL_SUM",
    "D2D1_TURBULENCE_NOISE_TURBULENCE",
    "D2D1_TURBULENCE_NOISE_FORCE_DWORD",
    "D2D1_DISPLACEMENTMAP_PROP_SCALE",
    "D2D1_DISPLACEMENTMAP_PROP_X_CHANNEL_SELECT",
    "D2D1_DISPLACEMENTMAP_PROP_Y_CHANNEL_SELECT",
    "D2D1_DISPLACEMENTMAP_PROP_FORCE_DWORD",
    "D2D1_COLORMANAGEMENT_PROP_SOURCE_COLOR_CONTEXT",
    "D2D1_COLORMANAGEMENT_PROP_SOURCE_RENDERING_INTENT",
    "D2D1_COLORMANAGEMENT_PROP_DESTINATION_COLOR_CONTEXT",
    "D2D1_COLORMANAGEMENT_PROP_DESTINATION_RENDERING_INTENT",
    "D2D1_COLORMANAGEMENT_PROP_ALPHA_MODE",
    "D2D1_COLORMANAGEMENT_PROP_QUALITY",
    "D2D1_COLORMANAGEMENT_PROP_FORCE_DWORD",
    "D2D1_COLORMANAGEMENT_ALPHA_MODE_PREMULTIPLIED",
    "D2D1_COLORMANAGEMENT_ALPHA_MODE_STRAIGHT",
    "D2D1_COLORMANAGEMENT_ALPHA_MODE_FORCE_DWORD",
    "D2D1_COLORMANAGEMENT_QUALITY_PROOF",
    "D2D1_COLORMANAGEMENT_QUALITY_NORMAL",
    "D2D1_COLORMANAGEMENT_QUALITY_BEST",
    "D2D1_COLORMANAGEMENT_QUALITY_FORCE_DWORD",
    "D2D1_COLORMANAGEMENT_RENDERING_INTENT_PERCEPTUAL",
    "D2D1_COLORMANAGEMENT_RENDERING_INTENT_RELATIVE_COLORIMETRIC",
    "D2D1_COLORMANAGEMENT_RENDERING_INTENT_SATURATION",
    "D2D1_COLORMANAGEMENT_RENDERING_INTENT_ABSOLUTE_COLORIMETRIC",
    "D2D1_COLORMANAGEMENT_RENDERING_INTENT_FORCE_DWORD",
    "D2D1_HISTOGRAM_PROP_NUM_BINS",
    "D2D1_HISTOGRAM_PROP_CHANNEL_SELECT",
    "D2D1_HISTOGRAM_PROP_HISTOGRAM_OUTPUT",
    "D2D1_HISTOGRAM_PROP_FORCE_DWORD",
    "D2D1_POINTSPECULAR_PROP_LIGHT_POSITION",
    "D2D1_POINTSPECULAR_PROP_SPECULAR_EXPONENT",
    "D2D1_POINTSPECULAR_PROP_SPECULAR_CONSTANT",
    "D2D1_POINTSPECULAR_PROP_SURFACE_SCALE",
    "D2D1_POINTSPECULAR_PROP_COLOR",
    "D2D1_POINTSPECULAR_PROP_KERNEL_UNIT_LENGTH",
    "D2D1_POINTSPECULAR_PROP_SCALE_MODE",
    "D2D1_POINTSPECULAR_PROP_FORCE_DWORD",
    "D2D1_POINTSPECULAR_SCALE_MODE_NEAREST_NEIGHBOR",
    "D2D1_POINTSPECULAR_SCALE_MODE_LINEAR",
    "D2D1_POINTSPECULAR_SCALE_MODE_CUBIC",
    "D2D1_POINTSPECULAR_SCALE_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_POINTSPECULAR_SCALE_MODE_ANISOTROPIC",
    "D2D1_POINTSPECULAR_SCALE_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_POINTSPECULAR_SCALE_MODE_FORCE_DWORD",
    "D2D1_SPOTSPECULAR_PROP_LIGHT_POSITION",
    "D2D1_SPOTSPECULAR_PROP_POINTS_AT",
    "D2D1_SPOTSPECULAR_PROP_FOCUS",
    "D2D1_SPOTSPECULAR_PROP_LIMITING_CONE_ANGLE",
    "D2D1_SPOTSPECULAR_PROP_SPECULAR_EXPONENT",
    "D2D1_SPOTSPECULAR_PROP_SPECULAR_CONSTANT",
    "D2D1_SPOTSPECULAR_PROP_SURFACE_SCALE",
    "D2D1_SPOTSPECULAR_PROP_COLOR",
    "D2D1_SPOTSPECULAR_PROP_KERNEL_UNIT_LENGTH",
    "D2D1_SPOTSPECULAR_PROP_SCALE_MODE",
    "D2D1_SPOTSPECULAR_PROP_FORCE_DWORD",
    "D2D1_SPOTSPECULAR_SCALE_MODE_NEAREST_NEIGHBOR",
    "D2D1_SPOTSPECULAR_SCALE_MODE_LINEAR",
    "D2D1_SPOTSPECULAR_SCALE_MODE_CUBIC",
    "D2D1_SPOTSPECULAR_SCALE_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_SPOTSPECULAR_SCALE_MODE_ANISOTROPIC",
    "D2D1_SPOTSPECULAR_SCALE_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_SPOTSPECULAR_SCALE_MODE_FORCE_DWORD",
    "D2D1_DISTANTSPECULAR_PROP_AZIMUTH",
    "D2D1_DISTANTSPECULAR_PROP_ELEVATION",
    "D2D1_DISTANTSPECULAR_PROP_SPECULAR_EXPONENT",
    "D2D1_DISTANTSPECULAR_PROP_SPECULAR_CONSTANT",
    "D2D1_DISTANTSPECULAR_PROP_SURFACE_SCALE",
    "D2D1_DISTANTSPECULAR_PROP_COLOR",
    "D2D1_DISTANTSPECULAR_PROP_KERNEL_UNIT_LENGTH",
    "D2D1_DISTANTSPECULAR_PROP_SCALE_MODE",
    "D2D1_DISTANTSPECULAR_PROP_FORCE_DWORD",
    "D2D1_DISTANTSPECULAR_SCALE_MODE_NEAREST_NEIGHBOR",
    "D2D1_DISTANTSPECULAR_SCALE_MODE_LINEAR",
    "D2D1_DISTANTSPECULAR_SCALE_MODE_CUBIC",
    "D2D1_DISTANTSPECULAR_SCALE_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_DISTANTSPECULAR_SCALE_MODE_ANISOTROPIC",
    "D2D1_DISTANTSPECULAR_SCALE_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_DISTANTSPECULAR_SCALE_MODE_FORCE_DWORD",
    "D2D1_POINTDIFFUSE_PROP_LIGHT_POSITION",
    "D2D1_POINTDIFFUSE_PROP_DIFFUSE_CONSTANT",
    "D2D1_POINTDIFFUSE_PROP_SURFACE_SCALE",
    "D2D1_POINTDIFFUSE_PROP_COLOR",
    "D2D1_POINTDIFFUSE_PROP_KERNEL_UNIT_LENGTH",
    "D2D1_POINTDIFFUSE_PROP_SCALE_MODE",
    "D2D1_POINTDIFFUSE_PROP_FORCE_DWORD",
    "D2D1_POINTDIFFUSE_SCALE_MODE_NEAREST_NEIGHBOR",
    "D2D1_POINTDIFFUSE_SCALE_MODE_LINEAR",
    "D2D1_POINTDIFFUSE_SCALE_MODE_CUBIC",
    "D2D1_POINTDIFFUSE_SCALE_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_POINTDIFFUSE_SCALE_MODE_ANISOTROPIC",
    "D2D1_POINTDIFFUSE_SCALE_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_POINTDIFFUSE_SCALE_MODE_FORCE_DWORD",
    "D2D1_SPOTDIFFUSE_PROP_LIGHT_POSITION",
    "D2D1_SPOTDIFFUSE_PROP_POINTS_AT",
    "D2D1_SPOTDIFFUSE_PROP_FOCUS",
    "D2D1_SPOTDIFFUSE_PROP_LIMITING_CONE_ANGLE",
    "D2D1_SPOTDIFFUSE_PROP_DIFFUSE_CONSTANT",
    "D2D1_SPOTDIFFUSE_PROP_SURFACE_SCALE",
    "D2D1_SPOTDIFFUSE_PROP_COLOR",
    "D2D1_SPOTDIFFUSE_PROP_KERNEL_UNIT_LENGTH",
    "D2D1_SPOTDIFFUSE_PROP_SCALE_MODE",
    "D2D1_SPOTDIFFUSE_PROP_FORCE_DWORD",
    "D2D1_SPOTDIFFUSE_SCALE_MODE_NEAREST_NEIGHBOR",
    "D2D1_SPOTDIFFUSE_SCALE_MODE_LINEAR",
    "D2D1_SPOTDIFFUSE_SCALE_MODE_CUBIC",
    "D2D1_SPOTDIFFUSE_SCALE_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_SPOTDIFFUSE_SCALE_MODE_ANISOTROPIC",
    "D2D1_SPOTDIFFUSE_SCALE_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_SPOTDIFFUSE_SCALE_MODE_FORCE_DWORD",
    "D2D1_DISTANTDIFFUSE_PROP_AZIMUTH",
    "D2D1_DISTANTDIFFUSE_PROP_ELEVATION",
    "D2D1_DISTANTDIFFUSE_PROP_DIFFUSE_CONSTANT",
    "D2D1_DISTANTDIFFUSE_PROP_SURFACE_SCALE",
    "D2D1_DISTANTDIFFUSE_PROP_COLOR",
    "D2D1_DISTANTDIFFUSE_PROP_KERNEL_UNIT_LENGTH",
    "D2D1_DISTANTDIFFUSE_PROP_SCALE_MODE",
    "D2D1_DISTANTDIFFUSE_PROP_FORCE_DWORD",
    "D2D1_DISTANTDIFFUSE_SCALE_MODE_NEAREST_NEIGHBOR",
    "D2D1_DISTANTDIFFUSE_SCALE_MODE_LINEAR",
    "D2D1_DISTANTDIFFUSE_SCALE_MODE_CUBIC",
    "D2D1_DISTANTDIFFUSE_SCALE_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_DISTANTDIFFUSE_SCALE_MODE_ANISOTROPIC",
    "D2D1_DISTANTDIFFUSE_SCALE_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_DISTANTDIFFUSE_SCALE_MODE_FORCE_DWORD",
    "D2D1_FLOOD_PROP_COLOR",
    "D2D1_FLOOD_PROP_FORCE_DWORD",
    "D2D1_LINEARTRANSFER_PROP_RED_Y_INTERCEPT",
    "D2D1_LINEARTRANSFER_PROP_RED_SLOPE",
    "D2D1_LINEARTRANSFER_PROP_RED_DISABLE",
    "D2D1_LINEARTRANSFER_PROP_GREEN_Y_INTERCEPT",
    "D2D1_LINEARTRANSFER_PROP_GREEN_SLOPE",
    "D2D1_LINEARTRANSFER_PROP_GREEN_DISABLE",
    "D2D1_LINEARTRANSFER_PROP_BLUE_Y_INTERCEPT",
    "D2D1_LINEARTRANSFER_PROP_BLUE_SLOPE",
    "D2D1_LINEARTRANSFER_PROP_BLUE_DISABLE",
    "D2D1_LINEARTRANSFER_PROP_ALPHA_Y_INTERCEPT",
    "D2D1_LINEARTRANSFER_PROP_ALPHA_SLOPE",
    "D2D1_LINEARTRANSFER_PROP_ALPHA_DISABLE",
    "D2D1_LINEARTRANSFER_PROP_CLAMP_OUTPUT",
    "D2D1_LINEARTRANSFER_PROP_FORCE_DWORD",
    "D2D1_GAMMATRANSFER_PROP_RED_AMPLITUDE",
    "D2D1_GAMMATRANSFER_PROP_RED_EXPONENT",
    "D2D1_GAMMATRANSFER_PROP_RED_OFFSET",
    "D2D1_GAMMATRANSFER_PROP_RED_DISABLE",
    "D2D1_GAMMATRANSFER_PROP_GREEN_AMPLITUDE",
    "D2D1_GAMMATRANSFER_PROP_GREEN_EXPONENT",
    "D2D1_GAMMATRANSFER_PROP_GREEN_OFFSET",
    "D2D1_GAMMATRANSFER_PROP_GREEN_DISABLE",
    "D2D1_GAMMATRANSFER_PROP_BLUE_AMPLITUDE",
    "D2D1_GAMMATRANSFER_PROP_BLUE_EXPONENT",
    "D2D1_GAMMATRANSFER_PROP_BLUE_OFFSET",
    "D2D1_GAMMATRANSFER_PROP_BLUE_DISABLE",
    "D2D1_GAMMATRANSFER_PROP_ALPHA_AMPLITUDE",
    "D2D1_GAMMATRANSFER_PROP_ALPHA_EXPONENT",
    "D2D1_GAMMATRANSFER_PROP_ALPHA_OFFSET",
    "D2D1_GAMMATRANSFER_PROP_ALPHA_DISABLE",
    "D2D1_GAMMATRANSFER_PROP_CLAMP_OUTPUT",
    "D2D1_GAMMATRANSFER_PROP_FORCE_DWORD",
    "D2D1_TABLETRANSFER_PROP_RED_TABLE",
    "D2D1_TABLETRANSFER_PROP_RED_DISABLE",
    "D2D1_TABLETRANSFER_PROP_GREEN_TABLE",
    "D2D1_TABLETRANSFER_PROP_GREEN_DISABLE",
    "D2D1_TABLETRANSFER_PROP_BLUE_TABLE",
    "D2D1_TABLETRANSFER_PROP_BLUE_DISABLE",
    "D2D1_TABLETRANSFER_PROP_ALPHA_TABLE",
    "D2D1_TABLETRANSFER_PROP_ALPHA_DISABLE",
    "D2D1_TABLETRANSFER_PROP_CLAMP_OUTPUT",
    "D2D1_TABLETRANSFER_PROP_FORCE_DWORD",
    "D2D1_DISCRETETRANSFER_PROP_RED_TABLE",
    "D2D1_DISCRETETRANSFER_PROP_RED_DISABLE",
    "D2D1_DISCRETETRANSFER_PROP_GREEN_TABLE",
    "D2D1_DISCRETETRANSFER_PROP_GREEN_DISABLE",
    "D2D1_DISCRETETRANSFER_PROP_BLUE_TABLE",
    "D2D1_DISCRETETRANSFER_PROP_BLUE_DISABLE",
    "D2D1_DISCRETETRANSFER_PROP_ALPHA_TABLE",
    "D2D1_DISCRETETRANSFER_PROP_ALPHA_DISABLE",
    "D2D1_DISCRETETRANSFER_PROP_CLAMP_OUTPUT",
    "D2D1_DISCRETETRANSFER_PROP_FORCE_DWORD",
    "D2D1_CONVOLVEMATRIX_PROP_KERNEL_UNIT_LENGTH",
    "D2D1_CONVOLVEMATRIX_PROP_SCALE_MODE",
    "D2D1_CONVOLVEMATRIX_PROP_KERNEL_SIZE_X",
    "D2D1_CONVOLVEMATRIX_PROP_KERNEL_SIZE_Y",
    "D2D1_CONVOLVEMATRIX_PROP_KERNEL_MATRIX",
    "D2D1_CONVOLVEMATRIX_PROP_DIVISOR",
    "D2D1_CONVOLVEMATRIX_PROP_BIAS",
    "D2D1_CONVOLVEMATRIX_PROP_KERNEL_OFFSET",
    "D2D1_CONVOLVEMATRIX_PROP_PRESERVE_ALPHA",
    "D2D1_CONVOLVEMATRIX_PROP_BORDER_MODE",
    "D2D1_CONVOLVEMATRIX_PROP_CLAMP_OUTPUT",
    "D2D1_CONVOLVEMATRIX_PROP_FORCE_DWORD",
    "D2D1_CONVOLVEMATRIX_SCALE_MODE_NEAREST_NEIGHBOR",
    "D2D1_CONVOLVEMATRIX_SCALE_MODE_LINEAR",
    "D2D1_CONVOLVEMATRIX_SCALE_MODE_CUBIC",
    "D2D1_CONVOLVEMATRIX_SCALE_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_CONVOLVEMATRIX_SCALE_MODE_ANISOTROPIC",
    "D2D1_CONVOLVEMATRIX_SCALE_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_CONVOLVEMATRIX_SCALE_MODE_FORCE_DWORD",
    "D2D1_BRIGHTNESS_PROP_WHITE_POINT",
    "D2D1_BRIGHTNESS_PROP_BLACK_POINT",
    "D2D1_BRIGHTNESS_PROP_FORCE_DWORD",
    "D2D1_ARITHMETICCOMPOSITE_PROP_COEFFICIENTS",
    "D2D1_ARITHMETICCOMPOSITE_PROP_CLAMP_OUTPUT",
    "D2D1_ARITHMETICCOMPOSITE_PROP_FORCE_DWORD",
    "D2D1_CROP_PROP_RECT",
    "D2D1_CROP_PROP_BORDER_MODE",
    "D2D1_CROP_PROP_FORCE_DWORD",
    "D2D1_BORDER_PROP_EDGE_MODE_X",
    "D2D1_BORDER_PROP_EDGE_MODE_Y",
    "D2D1_BORDER_PROP_FORCE_DWORD",
    "D2D1_BORDER_EDGE_MODE_CLAMP",
    "D2D1_BORDER_EDGE_MODE_WRAP",
    "D2D1_BORDER_EDGE_MODE_MIRROR",
    "D2D1_BORDER_EDGE_MODE_FORCE_DWORD",
    "D2D1_MORPHOLOGY_PROP_MODE",
    "D2D1_MORPHOLOGY_PROP_WIDTH",
    "D2D1_MORPHOLOGY_PROP_HEIGHT",
    "D2D1_MORPHOLOGY_PROP_FORCE_DWORD",
    "D2D1_MORPHOLOGY_MODE_ERODE",
    "D2D1_MORPHOLOGY_MODE_DILATE",
    "D2D1_MORPHOLOGY_MODE_FORCE_DWORD",
    "D2D1_TILE_PROP_RECT",
    "D2D1_TILE_PROP_FORCE_DWORD",
    "D2D1_ATLAS_PROP_INPUT_RECT",
    "D2D1_ATLAS_PROP_INPUT_PADDING_RECT",
    "D2D1_ATLAS_PROP_FORCE_DWORD",
    "D2D1_OPACITYMETADATA_PROP_INPUT_OPAQUE_RECT",
    "D2D1_OPACITYMETADATA_PROP_FORCE_DWORD",
    "D2D1_INTERPOLATION_MODE_NEAREST_NEIGHBOR",
    "D2D1_INTERPOLATION_MODE_LINEAR",
    "D2D1_INTERPOLATION_MODE_CUBIC",
    "D2D1_INTERPOLATION_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_INTERPOLATION_MODE_ANISOTROPIC",
    "D2D1_INTERPOLATION_MODE_HIGH_QUALITY_CUBIC",
    "D2D1_INTERPOLATION_MODE_FORCE_DWORD",
    "D2D1_BITMAP_OPTIONS_NONE",
    "D2D1_BITMAP_OPTIONS_TARGET",
    "D2D1_BITMAP_OPTIONS_CANNOT_DRAW",
    "D2D1_BITMAP_OPTIONS_CPU_READ",
    "D2D1_BITMAP_OPTIONS_GDI_COMPATIBLE",
    "D2D1_BITMAP_OPTIONS_FORCE_DWORD",
    "D2D1_MAP_OPTIONS_NONE",
    "D2D1_MAP_OPTIONS_READ",
    "D2D1_MAP_OPTIONS_WRITE",
    "D2D1_MAP_OPTIONS_DISCARD",
    "D2D1_CONTRAST_PROP_CONTRAST",
    "D2D1_CONTRAST_PROP_CLAMP_INPUT",
    "D2D1_CONTRAST_PROP_FORCE_DWORD",
    "D2D1_RGBTOHUE_PROP_OUTPUT_COLOR_SPACE",
    "D2D1_RGBTOHUE_PROP_FORCE_DWORD",
    "D2D1_RGBTOHUE_OUTPUT_COLOR_SPACE_HUE_SATURATION_VALUE",
    "D2D1_RGBTOHUE_OUTPUT_COLOR_SPACE_HUE_SATURATION_LIGHTNESS",
    "D2D1_RGBTOHUE_OUTPUT_COLOR_SPACE_FORCE_DWORD",
    "D2D1_HUETORGB_PROP_INPUT_COLOR_SPACE",
    "D2D1_HUETORGB_PROP_FORCE_DWORD",
    "D2D1_HUETORGB_INPUT_COLOR_SPACE_HUE_SATURATION_VALUE",
    "D2D1_HUETORGB_INPUT_COLOR_SPACE_HUE_SATURATION_LIGHTNESS",
    "D2D1_HUETORGB_INPUT_COLOR_SPACE_FORCE_DWORD",
    "D2D1_CHROMAKEY_PROP_COLOR",
    "D2D1_CHROMAKEY_PROP_TOLERANCE",
    "D2D1_CHROMAKEY_PROP_INVERT_ALPHA",
    "D2D1_CHROMAKEY_PROP_FEATHER",
    "D2D1_CHROMAKEY_PROP_FORCE_DWORD",
    "D2D1_EMBOSS_PROP_HEIGHT",
    "D2D1_EMBOSS_PROP_DIRECTION",
    "D2D1_EMBOSS_PROP_FORCE_DWORD",
    "D2D1_EXPOSURE_PROP_EXPOSURE_VALUE",
    "D2D1_EXPOSURE_PROP_FORCE_DWORD",
    "D2D1_POSTERIZE_PROP_RED_VALUE_COUNT",
    "D2D1_POSTERIZE_PROP_GREEN_VALUE_COUNT",
    "D2D1_POSTERIZE_PROP_BLUE_VALUE_COUNT",
    "D2D1_POSTERIZE_PROP_FORCE_DWORD",
    "D2D1_SEPIA_PROP_INTENSITY",
    "D2D1_SEPIA_PROP_ALPHA_MODE",
    "D2D1_SEPIA_PROP_FORCE_DWORD",
    "D2D1_SHARPEN_PROP_SHARPNESS",
    "D2D1_SHARPEN_PROP_THRESHOLD",
    "D2D1_SHARPEN_PROP_FORCE_DWORD",
    "D2D1_STRAIGHTEN_PROP_ANGLE",
    "D2D1_STRAIGHTEN_PROP_MAINTAIN_SIZE",
    "D2D1_STRAIGHTEN_PROP_SCALE_MODE",
    "D2D1_STRAIGHTEN_PROP_FORCE_DWORD",
    "D2D1_STRAIGHTEN_SCALE_MODE_NEAREST_NEIGHBOR",
    "D2D1_STRAIGHTEN_SCALE_MODE_LINEAR",
    "D2D1_STRAIGHTEN_SCALE_MODE_CUBIC",
    "D2D1_STRAIGHTEN_SCALE_MODE_MULTI_SAMPLE_LINEAR",
    "D2D1_STRAIGHTEN_SCALE_MODE_ANISOTROPIC",
    "D2D1_STRAIGHTEN_SCALE_MODE_FORCE_DWORD",
    "D2D1_TEMPERATUREANDTINT_PROP_TEMPERATURE",
    "D2D1_TEMPERATUREANDTINT_PROP_TINT",
    "D2D1_TEMPERATUREANDTINT_PROP_FORCE_DWORD",
    "D2D1_VIGNETTE_PROP_COLOR",
    "D2D1_VIGNETTE_PROP_TRANSITION_SIZE",
    "D2D1_VIGNETTE_PROP_STRENGTH",
    "D2D1_VIGNETTE_PROP_FORCE_DWORD",
    "D2D1_EDGEDETECTION_PROP_STRENGTH",
    "D2D1_EDGEDETECTION_PROP_BLUR_RADIUS",
    "D2D1_EDGEDETECTION_PROP_MODE",
    "D2D1_EDGEDETECTION_PROP_OVERLAY_EDGES",
    "D2D1_EDGEDETECTION_PROP_ALPHA_MODE",
    "D2D1_EDGEDETECTION_PROP_FORCE_DWORD",
    "D2D1_EDGEDETECTION_MODE_SOBEL",
    "D2D1_EDGEDETECTION_MODE_PREWITT",
    "D2D1_EDGEDETECTION_MODE_FORCE_DWORD",
    "D2D1_HIGHLIGHTSANDSHADOWS_PROP_HIGHLIGHTS",
    "D2D1_HIGHLIGHTSANDSHADOWS_PROP_SHADOWS",
    "D2D1_HIGHLIGHTSANDSHADOWS_PROP_CLARITY",
    "D2D1_HIGHLIGHTSANDSHADOWS_PROP_INPUT_GAMMA",
    "D2D1_HIGHLIGHTSANDSHADOWS_PROP_MASK_BLUR_RADIUS",
    "D2D1_HIGHLIGHTSANDSHADOWS_PROP_FORCE_DWORD",
    "D2D1_HIGHLIGHTSANDSHADOWS_INPUT_GAMMA_LINEAR",
    "D2D1_HIGHLIGHTSANDSHADOWS_INPUT_GAMMA_SRGB",
    "D2D1_HIGHLIGHTSANDSHADOWS_INPUT_GAMMA_FORCE_DWORD",
    "D2D1_LOOKUPTABLE3D_PROP_LUT",
    "D2D1_LOOKUPTABLE3D_PROP_ALPHA_MODE",
    "D2D1_LOOKUPTABLE3D_PROP_FORCE_DWORD",
    "D2D1_OPACITY_PROP_OPACITY",
    "D2D1_OPACITY_PROP_FORCE_DWORD",
    "D2D1_CROSSFADE_PROP_WEIGHT",
    "D2D1_CROSSFADE_PROP_FORCE_DWORD",
    "D2D1_TINT_PROP_COLOR",
    "D2D1_TINT_PROP_CLAMP_OUTPUT",
    "D2D1_TINT_PROP_FORCE_DWORD",
    "D2D1_WHITELEVELADJUSTMENT_PROP_INPUT_WHITE_LEVEL",
    "D2D1_WHITELEVELADJUSTMENT_PROP_OUTPUT_WHITE_LEVEL",
    "D2D1_WHITELEVELADJUSTMENT_PROP_FORCE_DWORD",
    "D2D1_HDRTONEMAP_PROP_INPUT_MAX_LUMINANCE",
    "D2D1_HDRTONEMAP_PROP_OUTPUT_MAX_LUMINANCE",
    "D2D1_HDRTONEMAP_PROP_DISPLAY_MODE",
    "D2D1_HDRTONEMAP_PROP_FORCE_DWORD",
    "D2D1_HDRTONEMAP_DISPLAY_MODE_SDR",
    "D2D1_HDRTONEMAP_DISPLAY_MODE_HDR",
    "D2D1_HDRTONEMAP_DISPLAY_MODE_FORCE_DWORD",
    "MF_INSERT",
    "MF_CHANGE",
    "MF_APPEND",
    "MF_DELETE",
    "MF_REMOVE",
    "MF_BYCOMMAND",
    "MF_BYPOSITION",
    "MF_SEPARATOR",
    "MF_ENABLED",
    "MF_GRAYED",
    "MF_DISABLED",
    "MF_UNCHECKED",
    "MF_CHECKED",
    "MF_USECHECKBITMAPS",
    "MF_STRING",
    "MF_BITMAP",
    "MF_OWNERDRAW",
    "MF_POPUP",
    "MF_MENUBARBREAK",
    "MF_MENUBREAK",
    "MF_UNHILITE",
    "MF_HILITE",
    "MF_DEFAULT",
    "MF_SYSMENU",
    "MF_HELP",
    "MF_RIGHTJUSTIFY",
    "MF_MOUSESELECT",
    "MF_END",
    "MFT_STRING",
    "MFT_BITMAP",
    "MFT_MENUBARBREAK",
    "MFT_MENUBREAK",
    "MFT_OWNERDRAW",
    "MFT_RADIOCHECK",
    "MFT_SEPARATOR",
    "MFT_RIGHTORDER",
    "MFT_RIGHTJUSTIFY",
    "MFS_GRAYED",
    "MFS_DISABLED",
    "MFS_CHECKED",
    "MFS_HILITE",
    "MFS_ENABLED",
    "MFS_UNCHECKED",
    "MFS_UNHILITE",
    "MFS_DEFAULT",
    "D2D1_FIGURE_BEGIN_FILLED",
    "D2D1_FIGURE_BEGIN_HOLLOW",
    "D2D1_FIGURE_END_OPEN",
    "D2D1_FIGURE_END_CLOSED",
    "WINEVENT_OUTOFCONTEXT",
    "WINEVENT_SKIPOWNTHREAD",
    "WINEVENT_SKIPOWNPROCESS",
    "WINEVENT_INCONTEXT",
    "CHILDID_SELF",
    "INDEXID_OBJECT",
    "INDEXID_CONTAINER",
    "OBJID_WINDOW",
    "OBJID_SYSMENU",
    "OBJID_TITLEBAR",
    "OBJID_MENU",
    "OBJID_CLIENT",
    "OBJID_VSCROLL",
    "OBJID_HSCROLL",
    "OBJID_SIZEGRIP",
    "OBJID_CARET",
    "OBJID_CURSOR",
    "OBJID_ALERT",
    "OBJID_SOUND",
    "OBJID_QUERYCLASSNAMEIDX",
    "OBJID_NATIVEOM",
    "EVENT_MIN",
    "EVENT_MAX",
    "EVENT_SYSTEM_SOUND",
    "EVENT_SYSTEM_ALERT",
    "EVENT_SYSTEM_FOREGROUND",
    "EVENT_SYSTEM_MENUSTART",
    "EVENT_SYSTEM_MENUEND",
    "EVENT_SYSTEM_MENUPOPUPSTART",
    "EVENT_SYSTEM_MENUPOPUPEND",
    "EVENT_SYSTEM_CAPTURESTART",
    "EVENT_SYSTEM_CAPTUREEND",
    "EVENT_SYSTEM_MOVESIZESTART",
    "EVENT_SYSTEM_MOVESIZEEND",
    "EVENT_SYSTEM_CONTEXTHELPSTART",
    "EVENT_SYSTEM_CONTEXTHELPEND",
    "EVENT_SYSTEM_DRAGDROPSTART",
    "EVENT_SYSTEM_DRAGDROPEND",
    "EVENT_SYSTEM_DIALOGSTART",
    "EVENT_SYSTEM_DIALOGEND",
    "EVENT_SYSTEM_SCROLLINGSTART",
    "EVENT_SYSTEM_SCROLLINGEND",
    "EVENT_SYSTEM_SWITCHSTART",
    "EVENT_SYSTEM_SWITCHEND",
    "EVENT_SYSTEM_MINIMIZESTART",
    "EVENT_SYSTEM_MINIMIZEEND",
    "EVENT_SYSTEM_DESKTOPSWITCH",
    "EVENT_SYSTEM_SWITCHER_APPGRABBED",
    "EVENT_SYSTEM_SWITCHER_APPOVERTARGET",
    "EVENT_SYSTEM_SWITCHER_APPDROPPED",
    "EVENT_SYSTEM_SWITCHER_CANCELLED",
    "EVENT_SYSTEM_IME_KEY_NOTIFICATION",
    "EVENT_SYSTEM_END",
    "EVENT_OEM_DEFINED_START",
    "EVENT_OEM_DEFINED_END",
    "EVENT_UIA_EVENTID_START",
    "EVENT_UIA_EVENTID_END",
    "EVENT_UIA_PROPID_START",
    "EVENT_UIA_PROPID_END",
    "EVENT_CONSOLE_CARET",
    "EVENT_CONSOLE_UPDATE_REGION",
    "EVENT_CONSOLE_UPDATE_SIMPLE",
    "EVENT_CONSOLE_UPDATE_SCROLL",
    "EVENT_CONSOLE_LAYOUT",
    "EVENT_CONSOLE_START_APPLICATION",
    "EVENT_CONSOLE_END_APPLICATION",
    "CONSOLE_APPLICATION_16BIT",
    "CONSOLE_APPLICATION_16BIT",
    "CONSOLE_CARET_SELECTION",
    "CONSOLE_CARET_VISIBLE",
    "EVENT_CONSOLE_END",
    "EVENT_OBJECT_CREATE",
    "EVENT_OBJECT_DESTROY",
    "EVENT_OBJECT_SHOW",
    "EVENT_OBJECT_HIDE",
    "EVENT_OBJECT_REORDER",
    "EVENT_OBJECT_FOCUS",
    "EVENT_OBJECT_SELECTION",
    "EVENT_OBJECT_SELECTIONADD",
    "EVENT_OBJECT_SELECTIONREMOVE",
    "EVENT_OBJECT_SELECTIONWITHIN",
    "EVENT_OBJECT_STATECHANGE",
    "EVENT_OBJECT_LOCATIONCHANGE",
    "EVENT_OBJECT_NAMECHANGE",
    "EVENT_OBJECT_DESCRIPTIONCHANGE",
    "EVENT_OBJECT_VALUECHANGE",
    "EVENT_OBJECT_PARENTCHANGE",
    "EVENT_OBJECT_HELPCHANGE",
    "EVENT_OBJECT_DEFACTIONCHANGE",
    "EVENT_OBJECT_ACCELERATORCHANGE",
    "EVENT_OBJECT_INVOKED",
    "EVENT_OBJECT_TEXTSELECTIONCHANGED",
    "EVENT_OBJECT_CONTENTSCROLLED",
    "EVENT_SYSTEM_ARRANGMENTPREVIEW",
    "EVENT_OBJECT_CLOAKED",
    "EVENT_OBJECT_UNCLOAKED",
    "EVENT_OBJECT_LIVEREGIONCHANGED",
    "EVENT_OBJECT_HOSTEDOBJECTSINVALIDATED",
    "EVENT_OBJECT_DRAGSTART",
    "EVENT_OBJECT_DRAGCANCEL",
    "EVENT_OBJECT_DRAGCOMPLETE",
    "EVENT_OBJECT_DRAGENTER",
    "EVENT_OBJECT_DRAGLEAVE",
    "EVENT_OBJECT_DRAGDROPPED",
    "EVENT_OBJECT_IME_SHOW",
    "EVENT_OBJECT_IME_HIDE",
    "EVENT_OBJECT_IME_CHANGE",
    "EVENT_OBJECT_TEXTEDIT_CONVERSIONTARGETCHANGED",
    "EVENT_OBJECT_END",
    "EVENT_AIA_START",
    "EVENT_AIA_END",
    "SOUND_SYSTEM_STARTUP",
    "SOUND_SYSTEM_SHUTDOWN",
    "SOUND_SYSTEM_BEEP",
    "SOUND_SYSTEM_ERROR",
    "SOUND_SYSTEM_QUESTION",
    "SOUND_SYSTEM_WARNING",
    "SOUND_SYSTEM_INFORMATION",
    "SOUND_SYSTEM_MAXIMIZE",
    "SOUND_SYSTEM_MINIMIZE",
    "SOUND_SYSTEM_RESTOREUP",
    "SOUND_SYSTEM_RESTOREDOWN",
    "SOUND_SYSTEM_APPSTART",
    "SOUND_SYSTEM_FAULT",
    "SOUND_SYSTEM_APPEND",
    "SOUND_SYSTEM_MENUCOMMAND",
    "SOUND_SYSTEM_MENUPOPUP",
    "CSOUND_SYSTEM",
    "ALERT_SYSTEM_INFORMATIONAL",
    "ALERT_SYSTEM_WARNING",
    "ALERT_SYSTEM_ERROR",
    "ALERT_SYSTEM_QUERY",
    "ALERT_SYSTEM_CRITICAL",
    "CALERT_SYSTEM",
    "PROCESS_TERMINATE",
    "PROCESS_CREATE_THREAD",
    "PROCESS_SET_SESSIONID",
    "PROCESS_VM_OPERATION",
    "PROCESS_VM_READ",
    "PROCESS_VM_WRITE",
    "PROCESS_DUP_HANDLE",
    "PROCESS_CREATE_PROCESS",
    "PROCESS_SET_QUOTA",
    "PROCESS_SET_INFORMATION",
    "PROCESS_QUERY_INFORMATION",
    "PROCESS_SUSPEND_RESUME",
    "PROCESS_QUERY_LIMITED_INFORMATION",
    "PROCESS_SET_LIMITED_INFORMATION",
    "PROCESS_ALL_ACCESS",
    "THREAD_TERMINATE",
    "THREAD_SUSPEND_RESUME",
    "THREAD_GET_CONTEXT",
    "THREAD_SET_CONTEXT",
    "THREAD_QUERY_INFORMATION",
    "THREAD_SET_INFORMATION",
    "THREAD_SET_THREAD_TOKEN",
    "THREAD_IMPERSONATE",
    "THREAD_DIRECT_IMPERSONATION",
    "THREAD_SET_LIMITED_INFORMATION",
    "THREAD_QUERY_LIMITED_INFORMATION",
    "THREAD_RESUME",
    "THREAD_ALL_ACCESS",
    "JOB_OBJECT_ASSIGN_PROCESS",
    "JOB_OBJECT_SET_ATTRIBUTES",
    "JOB_OBJECT_QUERY",
    "JOB_OBJECT_TERMINATE",
    "JOB_OBJECT_SET_SECURITY_ATTRIBUTES",
    "JOB_OBJECT_IMPERSONATE",
    "JOB_OBJECT_ALL_ACCESS",
    "DELETE",
    "READ_CONTROL",
    "WRITE_DAC",
    "WRITE_OWNER",
    "SYNCHRONIZE",
    "STANDARD_RIGHTS_REQUIRED",
    "STANDARD_RIGHTS_READ",
    "STANDARD_RIGHTS_WRITE",
    "STANDARD_RIGHTS_EXECUTE",
    "STANDARD_RIGHTS_ALL",
    "SPECIFIC_RIGHTS_ALL",
    "LIST_MODULES_32BIT",
    "LIST_MODULES_64BIT",
    "LIST_MODULES_ALL",
    "LIST_MODULES_DEFAULT",
    "FOREGROUND_BLUE",
    "FOREGROUND_GREEN",
    "FOREGROUND_RED",
    "FOREGROUND_INTENSITY",
    "BACKGROUND_BLUE",
    "BACKGROUND_GREEN",
    "BACKGROUND_RED",
    "BACKGROUND_INTENSITY",
    "COMMON_LVB_LEADING_BYTE",
    "COMMON_LVB_TRAILING_BYTE",
    "COMMON_LVB_GRID_HORIZONTAL",
    "COMMON_LVB_GRID_LVERTICAL",
    "COMMON_LVB_GRID_RVERTICAL",
    "COMMON_LVB_REVERSE_VIDEO",
    "COMMON_LVB_UNDERSCORE",
    "COMMON_LVB_SBCSDBCS",
    "STD_INPUT_HANDLE",
    "STD_OUTPUT_HANDLE",
    "STD_ERROR_HANDLE",
    "EASYTAB_OK",
    "EASYTAB_MEMORY_ERROR",
    "EASYTAB_X11_ERROR",
    "EASYTAB_DLL_LOAD_ERROR",
    "EASYTAB_WACOM_WIN32_ERROR",
    "EASYTAB_INVALID_FUNCTION_ERROR",
    "EASYTAB_EVENT_NOT_HANDLED",
    "EASYTAB_TRACKING_MODE_SYSTEM",
    "EASYTAB_TRACKING_MODE_RELATIVE",
    "EasyTab_Buttons_Pen_Touch", //why are these not capitalized
    "EasyTab_Buttons_Pen_Lower", //why are these not capitalized
    "EasyTab_Buttons_Pen_Upper", //why are these not capitalized
    "PBS_SMOOTH",
    "PBS_VERTICAL",
    "PBM_SETRANGE",
    "PBM_SETPOS",
    "PBM_DELTAPOS",
    "PBM_SETSTEP",
    "PBM_STEPIT",
    "PBM_SETRANGE32",
    "PBM_GETRANGE",
    "PBM_GETPOS",
    "PBM_SETBARCOLOR",
    "PBM_SETBKCOLOR",
    "PBS_MARQUEE",
    "PBM_SETMARQUEE",
    "PBS_SMOOTHREVERSE",
    "PBM_GETSTEP",
    "PBM_GETBKCOLOR",
    "PBM_GETBARCOLOR",
    "PBM_SETSTATE",
    "PBM_GETSTATE",
    "PBST_NORMAL",
    "PBST_ERROR",
    "PBST_PAUSED",
    //"PROGRESS_CLASS",
    "RIDI_PREPARSEDDATA",
    "RIDI_DEVICENAME",
    "RIDI_DEVICEINFO",
    "RIM_TYPEMOUSE",
    "RIM_TYPEKEYBOARD",
    "RIM_TYPEHID",
    "RIM_INPUT",
    "RIM_INPUTSINK",
    "RID_HEADER",
    "RIDEV_REMOVE",
    "RIDEV_EXCLUDE",
    "RIDEV_PAGEONLY",
    "RIDEV_NOLEGACY",
    "RIDEV_INPUTSINK",
    "RIDEV_CAPTUREMOUSE",
    "RIDEV_NOHOTKEYS",
    "RIDEV_APPKEYS",
    "RIDEV_EXINPUTSINK",
    "RIDEV_DEVNOTIFY",
    "RIDEV_EXMODEMASK",
    "RI_MOUSE_LEFT_BUTTON_DOWN",
    "RI_MOUSE_LEFT_BUTTON_UP",
    "RI_MOUSE_RIGHT_BUTTON_DOWN",
    "RI_MOUSE_RIGHT_BUTTON_UP",
    "RI_MOUSE_MIDDLE_BUTTON_DOWN",
    "RI_MOUSE_MIDDLE_BUTTON_UP",
    "RI_MOUSE_BUTTON_1_DOWN",
    "RI_MOUSE_BUTTON_1_UP",
    "RI_MOUSE_BUTTON_2_DOWN",
    "RI_MOUSE_BUTTON_2_UP",
    "RI_MOUSE_BUTTON_3_DOWN",
    "RI_MOUSE_BUTTON_3_UP",
    "RI_MOUSE_BUTTON_4_DOWN",
    "RI_MOUSE_BUTTON_4_UP",
    "RI_MOUSE_BUTTON_5_DOWN",
    "RI_MOUSE_BUTTON_5_UP",
    "RI_MOUSE_WHEEL",
    "RI_MOUSE_HWHEEL",
    "MOUSE_MOVE_RELATIVE",
    "MOUSE_MOVE_ABSOLUTE",
    "MOUSE_VIRTUAL_DESKTOP",
    "MOUSE_ATTRIBUTES_CHANGED",
    "MOUSE_MOVE_NOCOALESCE",
    "OBJ_BITMAP",
    "OBJ_BRUSH",
    "OBJ_COLORSPACE",
    "OBJ_FONT",
    "OBJ_PAL",
    "OBJ_PEN",
    "MOD_ALT",
    "MOD_CONTROL",
    "MOD_NOREPEAT",
    "MOD_SHIFT",
    "MOD_WIN",
    "FLOODFILLBORDER",
    "FLOODFILLSURFACE",
    "IDHOT_SNAPDESKTOP",
    "IDHOT_SNAPWINDOW",
    "GRADIENT_FILL_RECT_H",
    "GRADIENT_FILL_RECT_V",
    "GRADIENT_FILL_TRIANGLE",
    "ANIMATE_CLASS",
    "ACS_CENTER",
    "ACS_TRANSPARENT",
    "ACS_AUTOPLAY",
    "ACS_TIMER",
    "ACM_OPEN",
    "ACM_PLAY",
    "ACM_STOP",
    "ACM_ISPLAYING",
    "ACN_START",
    "ACN_STOP",

    "DATETIMEPICK_CLASS",
    "HOTKEY_CLASS",
    "MONTHCAL_CLASS",
    "PROGRESS_CLASS",
    "REBARCLASSNAME",
    "RBIM_IMAGELIST",
    "RBS_TOOLTIPS",
    "RBS_VARHEIGHT",
    "RBS_BANDBORDERS",
    "RBS_FIXEDORDER",
    "RBS_REGISTERDROP",
    "RBS_AUTOSIZE",
    "RBS_VERTICALGRIPPER",
    "RBS_DBLCLKTOGGLE",
    "CCS_TOP",
    "CCS_NOMOVEY",
    "CCS_BOTTOM",
    "CCS_NORESIZE",
    "CCS_NOPARENTALIGN",
    "CCS_ADJUSTABLE",
    "CCS_NODIVIDER",
    "CCS_VERT",
    "CCS_LEFT",
    "CCS_RIGHT",
    "CCS_NOMOVEX",
    "ILC_MASK",
    "ILC_COLOR",
    "ILC_COLORDDB",
    "ILC_COLOR4",
    "ILC_COLOR8",
    "ILC_COLOR16",
    "ILC_COLOR24",
    "ILC_COLOR32",
    "ILC_PALETTE",
    "ILC_MIRROR",
    "ILC_PERITEMMIRROR",
    "ILC_ORIGINALSIZE",
    "ILC_HIGHQUALITYSCALE",
    "RB_INSERTBANDA",
    "RB_DELETEBAND",
    "RB_GETBARINFO",
    "RB_SETBARINFO",
    "RB_SETBANDINFOA",
    "RB_SETPARENT",
    "RB_HITTEST",
    "RB_GETRECT",
    "RB_INSERTBANDW",
    "RB_SETBANDINFOW",
    "RB_GETBANDCOUNT",
    "RB_GETROWCOUNT",
    "RB_GETROWHEIGHT",
    "RB_IDTOINDEX",
    "RB_GETTOOLTIPS",
    "RB_SETTOOLTIPS",
    "RB_SETBKCOLOR",
    "RB_GETBKCOLOR",
    "RB_SETTEXTCOLOR",
    "RB_GETTEXTCOLOR",
    "RBSTR_CHANGERECT",
    "RB_SIZETORECT",
    "RB_SETCOLORSCHEME",
    "RB_GETCOLORSCHEME",
    "RB_INSERTBAND",
    "RB_SETBANDINFO",
    "RB_BEGINDRAG",
    "RB_ENDDRAG",
    "RB_DRAGMOVE",
    "RB_GETBARHEIGHT",
    "RB_GETBANDINFOW",
    "RB_GETBANDINFOA",
    "RB_GETBANDINFO",
    "RB_MINIMIZEBAND",
    "RB_MAXIMIZEBAND",
    "RB_GETDROPTARGET",
    "RB_GETBANDBORDERS",
    "RB_SHOWBAND",
    "RB_SETPALETTE",
    "RB_GETPALETTE",
    "RB_MOVEBAND",
    "RB_SETUNICODEFORMAT",
    "RB_GETUNICODEFORMAT",
    "RB_GETBANDMARGINS",
    "RB_SETWINDOWTHEME",
    "RB_SETEXTENDEDSTYLE",
    "RB_GETEXTENDEDSTYLE",
    "RB_PUSHCHEVRON",
    "RB_SETBANDWIDTH",
    "RBN_HEIGHTCHANGE",
    "RBN_GETOBJECT",
    "RBN_LAYOUTCHANGED",
    "RBN_AUTOSIZE",
    "RBN_BEGINDRAG",
    "RBN_ENDDRAG",
    "RBN_DELETINGBAND",
    "RBN_DELETEDBAND",
    "RBN_CHILDSIZE",
    "RBN_CHEVRONPUSHED",
    "RBN_SPLITTERDRAG",
    "RBN_MINMAX",
    "RBN_AUTOBREAK",
    "RBBS_BREAK",
    "RBBS_FIXEDSIZE",
    "RBBS_CHILDEDGE",
    "RBBS_HIDDEN",
    "RBBS_NOVERT",
    "RBBS_FIXEDBMP",
    "RBBS_VARIABLEHEIGHT",
    "RBBS_GRIPPERALWAYS",
    "RBBS_NOGRIPPER",
    "RBBS_USECHEVRON",
    "RBBS_HIDETITLE",
    "RBBS_TOPALIGN",
    "RBBIM_STYLE",
    "RBBIM_COLORS",
    "RBBIM_TEXT",
    "RBBIM_IMAGE",
    "RBBIM_CHILD",
    "RBBIM_CHILDSIZE",
    "RBBIM_SIZE",
    "RBBIM_BACKGROUND",
    "RBBIM_ID",
    "RBBIM_IDEALSIZE",
    "RBBIM_LPARAM",
    "RBBIM_HEADERSIZE",
    "RBBIM_CHEVRONLOCATION",
    "RBBIM_CHEVRONSTATE",

    "STATUSCLASSNAME",
    "TOOLBARCLASSNAME",
    "TOOLTIPS_CLASS",
    "TRACKBAR_CLASS",
    "UPDOWN_CLASS",
    "WC_BUTTON",
    "WC_COMBOBOX",
    "WC_COMBOBOXEX",
    "WC_EDIT",
    "WC_HEADER",
    "HDI_WIDTH",
    "HDI_HEIGHT",
    "HDI_TEXT",
    "HDI_FORMAT",
    "HDI_LPARAM",
    "HDI_BITMAP",
    "HDI_IMAGE",
    "HDI_DI_SETITEM",
    "HDI_ORDER",
    "HDI_FILTER",
    "HDI_STATE",
    "HDF_LEFT",
    "HDF_RIGHT",
    "HDF_CENTER",
    "HDF_JUSTIFYMASK",
    "HDF_RTLREADING",
    "HDF_BITMAP",
    "HDF_STRING",
    "HDF_OWNERDRAW",
    "HDF_IMAGE",
    "HDF_BITMAP_ON_RIGHT",
    "HDF_SORTUP",
    "HDF_SORTDOWN",
    "HDF_CHECKBOX",
    "HDF_CHECKED",
    "HDF_FIXEDWIDTH",
    "HDF_SPLITBUTTON",
    "HDIS_FOCUSED",
    "HDM_GETITEMCOUNT",
    "HDM_INSERTITEMA",
    "HDM_INSERTITEMW",
    "HDM_INSERTITEM",
    "HDM_GETITEM",
    "HDM_SETITEM",
    "HHT_NOWHERE",
    "HHT_ONHEADER",
    "HHT_ONDIVIDER",
    "HHT_ONDIVOPEN",
    "HHT_ONFILTER",
    "HHT_ONFILTERBUTTON",
    "HHT_ABOVE",
    "HHT_BELOW",
    "HHT_TORIGHT",
    "HHT_TOLEFT",
    "HHT_ONITEMSTATEICON",
    "HHT_ONDROPDOWN",
    "HHT_ONOVERFLOW",
    "HDS_HORZ",
    "HDS_BUTTONS",
    "HDS_HOTTRACK",
    "HDS_HIDDEN",
    "HDS_DRAGDROP",
    "HDS_FULLDRAG",
    "HDS_FILTERBAR",
    "HDS_FLAT",
    "HDS_CHECKBOXES",
    "HDS_NOSIZING",
    "HDS_OVERFLOW",
    "HDFT_ISSTRING",
    "HDFT_ISNUMBER",
    "HDFT_ISDATE",
    "HDFT_HASNOVALUE",
    "HDN_ITEMCHANGING",
    "HDN_ITEMCHANGED",
    "HDN_ITEMCLICK",
    "HDN_ITEMDBLCLICK",
    "HDN_DIVIDERDBLCLICK",
    "HDN_BEGINTRACK",
    "HDN_ENDTRACK",
    "HDN_TRACK",
    "HDN_GETDISPINFO",
    "HDM_LAYOUT",

    "WC_LISTBOX",
    "WC_IPADDRESS",
    "WC_LINK",
    "WC_LISTVIEW",
    "WC_NATIVEFONTCTL",
    "WC_PAGESCROLLER",
    "WC_SCROLLBAR",
    "WC_STATIC",
    "WC_TABCONTROL",
    "WC_TREEVIEW",
    "ICC_LISTVIEW_CLASSES",
    "ICC_TREEVIEW_CLASSES",
    "ICC_BAR_CLASSES",
    "ICC_TAB_CLASSES",
    "ICC_UPDOWN_CLASS",
    "ICC_PROGRESS_CLASS",
    "ICC_HOTKEY_CLASS",
    "ICC_ANIMATE_CLASS",
    "ICC_WIN95_CLASSES",
    "ICC_DATE_CLASSES",
    "ICC_USEREX_CLASSES",
    "ICC_COOL_CLASSES",
    "ICC_INTERNET_CLASSES",
    "ICC_PAGESCROLLER_CLASS",
    "ICC_NATIVEFNTCTL_CLASS",
    "ICC_STANDARD_CLASSES",
    "ICC_LINK_CLASS",
    //"TDCBF_OK_BUTTON",
    //"TDCBF_YES_BUTTON",
    //"TDCBF_NO_BUTTON",
    //"TDCBF_CANCEL_BUTTON",
    //"TDCBF_RETRY_BUTTON",
    //"TDCBF_CLOSE_BUTTON",
    //"TD_WARNING_ICON",
    //"TD_ERROR_ICON",
    //"TD_INFORMATION_ICON",
    //"TD_SHIELD_ICON",
    "FILE_NOTIFY_CHANGE_FILE_NAME",
    "FILE_NOTIFY_CHANGE_DIR_NAME",
    "FILE_NOTIFY_CHANGE_ATTRIBUTES",
    "FILE_NOTIFY_CHANGE_SIZE",
    "FILE_NOTIFY_CHANGE_LAST_WRITE",
    "FILE_NOTIFY_CHANGE_LAST_ACCESS",
    "FILE_NOTIFY_CHANGE_CREATION",
    "FILE_NOTIFY_CHANGE_SECURITY",
    "WAIT_ABANDONED",
    "WAIT_IO_COMPLETION",
    "WAIT_OBJECT_0",
    "WAIT_TIMEOUT",
    "WAIT_FAILED",
    "PAGE_NOACCESS",
    "PAGE_READONLY",
    "PAGE_READWRITE",
    "PAGE_WRITECOPY",
    "PAGE_EXECUTE",
    "PAGE_EXECUTE_READ",
    "PAGE_EXECUTE_READWRITE",
    "PAGE_EXECUTE_WRITECOPY",
    "PAGE_GUARD",
    "PAGE_NOCACHE",
    "PAGE_WRITECOMBINE",
    "PAGE_GRAPHICS_NOACCESS",
    "PAGE_GRAPHICS_READONLY",
    "PAGE_GRAPHICS_READWRITE",
    "PAGE_GRAPHICS_EXECUTE",
    "PAGE_GRAPHICS_EXECUTE_READ",
    "PAGE_GRAPHICS_EXECUTE_READWRITE",
    "PAGE_GRAPHICS_COHERENT",
    "PAGE_GRAPHICS_NOCACHE",
    "PAGE_ENCLAVE_THREAD_CONTROL",
    "PAGE_REVERT_TO_FILE_MAP",
    "PAGE_TARGETS_NO_UPDATE",
    "PAGE_TARGETS_INVALID",
    "PAGE_ENCLAVE_UNVALIDATED",
    "PAGE_ENCLAVE_MASK",
    "PAGE_ENCLAVE_DECOMMIT",
    "PAGE_ENCLAVE_SS_FIRST",
    "PAGE_ENCLAVE_SS_REST",
    "MEM_COMMIT",
    "MEM_RESERVE",
    "MEM_REPLACE_PLACEHOLDER",
    "MEM_RESERVE_PLACEHOLDER",
    "MEM_RESET",
    "MEM_TOP_DOWN",
    "MEM_WRITE_WATCH",
    "MEM_PHYSICAL",
    "MEM_ROTATE",
    "MEM_DIFFERENT_IMAGE_BASE_OK",
    "MEM_RESET_UNDO",
    "MEM_LARGE_PAGES",
    "MEM_4MB_PAGES",
    "MEM_64K_PAGES",
    "MEM_UNMAP_WITH_TRANSIENT_BOOST",
    "MEM_COALESCE_PLACEHOLDERS",
    "MEM_PRESERVE_PLACEHOLDER",
    "MEM_DECOMMIT",
    "MEM_RELEASE",
    "MEM_FREE",
    "MEM_EXTENDED_PARAMETER_GRAPHICS",
    "MEM_EXTENDED_PARAMETER_NONPAGED",
    "MEM_EXTENDED_PARAMETER_ZERO_PAGES_OPTIONAL",
    "MEM_EXTENDED_PARAMETER_NONPAGED_LARGE",
    "MEM_EXTENDED_PARAMETER_NONPAGED_HUGE",
    "MEM_EXTENDED_PARAMETER_SOFT_FAULT_PAGES",
    "MEM_EXTENDED_PARAMETER_EC_CODE",
    "MEM_EXTENDED_PARAMETER_NUMA_NODE_MANDATORY",
    "TME_CANCEL",
    "TME_HOVER",
    "TME_LEAVE",
    "TME_NONCLIENT",
    "TME_QUERY",
    "HOVER_DEFAULT",
    "HTERROR",
    "HTTRANSPARENT",
    "HTNOWHERE",
    "HTCLIENT",
    "HTCAPTION",
    "HTSYSMENU",
    "HTGROWBOX",
    "HTSIZE",
    "HTMENU",
    "HTHSCROLL",
    "HTVSCROLL",
    "HTMINBUTTON",
    "HTMAXBUTTON",
    "HTLEFT",
    "HTRIGHT",
    "HTTOP",
    "HTTOPLEFT",
    "HTTOPRIGHT",
    "HTBOTTOM",
    "HTBOTTOMLEFT",
    "HTBOTTOMRIGHT",
    "HTBORDER",
    "HTREDUCE",
    "HTZOOM",
    "HTSIZEFIRST",
    "HTSIZELAST",
    "HTOBJECT",
    "HTCLOSE",
    "HTHELP",
    "FR_PRIVATE",
    "FR_NOT_ENUM",
];