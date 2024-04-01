"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved. //im not gonna lie i didn't even know this was here
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
//const macros = [];
//const funcs = ["function print(...) : void", "function version(void) : String", "function require(type : String) : String"];
//bruh idk if i said this but this is my first time using typescript but i've heard of it before
const funcs = [];
const objects = [];
function makeArgs(info, desc) {
    return { info, desc, args: info.substring(info.indexOf("(") + 1, info.indexOf(")")).split(", ") };
}
const objectFunctions = {
    "BeginDraw": makeArgs("function BeginDraw(void) : void", "calls the native `BeginDraw` function on the direct2d renderTarget"),
    "EndDraw": makeArgs("function EndDraw(void) : void", "calls the native `EndDraw` function on the direct2d renderTarget"),
    "Resize": makeArgs("function Resize(width : number, height : number) : HRESULT", "resizes the internal RenderTarget"),
    "CreateSolidColorBrush": makeArgs("function CreateSolidColorBrush(r : float, g : float, b : float, alpha? : number) : SolidColorBrush", "returns a `Brush` object with 2 unique methods  \n`SetColor` and `GetColor`"),
    "DrawRectangle": makeArgs("function DrawRectangle(left : number, top : number, right : number, bottom : number, brush : Brush, strokeWidth? : number, strokeStyle? : number) : void", "tells direct2d to draw a rectangle's outline using the arguments"),
    "DrawGradientRectangle": makeArgs("function DrawGradientRectangle(left : number, top : number, right : number, bottom : number, brush : GradientBrush, gradientRotation? : number | float, strokeWidth? : number, strokeStyle? : number) : void", "convenience method to draw a rectangle's outline as a gradient at the same position, and size"),
    "FillRectangle": makeArgs("function FillRectangle(left : number, top : number, right : number, bottom : number, brush : Brush) : void", "fills a rectangle starting from the left and top coordinates to the right and bottom coordinates with the brush's color/bitmap/gradient"),
    "FillGradientRectangle": makeArgs("function FillGradientRectangle(left : number, top : number, right : number, bottom : number, brush : GradientBrush, gradientRotation? : number | float)", "convenience method to fill a rectangle with a gradient brush"),
    "DrawGradientEllipse": makeArgs("function DrawGradientEllipse", "convenience method to draw an ellipse's outline with a gradient brush"),
    "DrawEllipse": makeArgs("function DrawEllipse(x : number, y : number, radiusX : number, radiusY : number, brush : Brush, strokeWidth? : number, strokeStyle? : number) : void", "draws the outline of an ellipse with the brush and strokeWidth"),
    "FillEllipse": makeArgs("function FillEllipse(x : number, y : number, radiusX : number, radiusY : number, brush : Brush) : void", "fills an ellipse at the starting point"),
    "FillGradientEllipse": makeArgs("function FillGradientEllipse(x : number, y : number, radiusX : number, radiusY : number, brush : GradientBrush, gradientRotation? : number | float) : void", "convenience method to fill an ellipse with a gradient"),
    //"CreateFont" : makeArgs("function CreateFont(fontFamily : string, size : number | float) : TextFormat | Font | {internalPtr : number, family : string, Release : function}", "used in the `DrawText` and `DrawGradientText` methods  \nreturns an object for calling the internal `TextFormat`'s release method"),
    "CreateFont": makeArgs("function CreateFont(fontFamily : string, size : number | float) : TextFormat | Font", "used in the `DrawText` and `DrawGradientText` methods"),
    "DrawText": makeArgs("function DrawText(text : string, textFormat : TextFormat | Font, left : number, top : number, right : number, bottom : number, brush : Brush) : void", "draws the string `text` with the specified size and brush"),
    "DrawGradientText": makeArgs("function DrawGradientText(text : string, textFormat : TextFormat | Font, left : number, top : number, right : number, bottom : number, brush : GradientBrush, gradientRotation? : number | float) : void", "convenience method for drawing text with a gradient brush (don't work as good)"),
    "CreateBitmap": makeArgs("function CreateBitmap(width : number, height : number) : Bitmap", "creates an empty bitmap with the specified `width` and `height`  \nreturns a custom object with all ID2D1Brush properties besides (`Get`/`Set`)`Transform`"),
    "CreateBitmapFromFilename": makeArgs("function CreateBitmapFromFilename(filename : string) : Bitmap", "creates a bitmap with the specified image inside (can be .png/.jpg/.bmp/.whatever)  \nreturns a custom object with all ID2D1Brush properties besides (`Get`/`Set`)`Transform`"),
    "DrawBitmap": makeArgs("function DrawBitmap(bitmap : Bitmap, destLeft : number, destTop : number, destRight : number, destBottom : number, opacity : float, bitmapInterpolationMode? : enum D2D1_BITMAP_INTERPOLATION_MODE, srcLeft? : number, srcTop? : number, srcRight? : number, srcBottom? : number) : void", "the `dest` args are where the bitmap will be drawn  \nthe `src` args are how much of the bitmap will be drawn (optional because defaults)  \ninterpolationMode can be any `D2D1_BITMAP_INTERPOLATION_MODE` const"),
    "CreateBitmapBrush": makeArgs("function CreateBitmapBrush(bitmap : Bitmap) : BitmapBrush", "returns a bitmap brush with ykykyk look at `direct2d CreateBitmapBrush msn` dawg"),
    //"CreateGradientStopCollection" : makeArgs("function CreateGradientStopCollection(gradientStops : Array<[position : float, r : float, g : float, b : float, alpha? : float]>) : IUnknown", "creates the gradient stop collection for use in the `Create`(`Linear`/`Radial`)`GradientBrush`  \nreturns the basic IUnknown methods/fields (`Release()`, `internalPtr`)  \nnot sure if the alpha works but that ain't my fault"),
    "CreateGradientStopCollection": makeArgs("function CreateGradientStopCollection(...gradientStops : [position : float, r : float, g : float, b : float, alpha? : float]) : IUnknown", "creates the gradient stop collection for use in the `Create`(`Linear`/`Radial`)`GradientBrush`  \nreturns the basic IUnknown methods/fields (`Release()`, `internalPtr`)  \nnot sure if the alpha works but that ain't my fault"),
    "CreateLinearGradientBrush": makeArgs("function CreateLinearGradientBrush(startX : number, startY : number, endX : number, endY : number, gradientStopCollection : GradientStopCollection) : LinearGradientBrush", "creates a linear gradient brush for drawing"),
    "CreateRadialGradientBrush": makeArgs("function CreateRadialGradientBrush(centerX : number, centerY : number, offsetX : number, offsetY : number, radiusX : number, radiusY : number, gradientStopCollection : GradientStopCollection) : RadialGradientBrush", "creates a radial gradient brush for drawing"),
    "RestoreDrawingState": makeArgs("function RestoreDrawingState", ""),
    "CreateDrawingStateBlock": makeArgs("function CreateDrawingStateBlock", ""),
    "SaveDrawingState": makeArgs("function SaveDrawingState", ""),
    "DrawGradientRoundedRectangle": makeArgs("function DrawGradientRoundedRectangle(left : number, top : number, right : number, bottom : number, radiusX : number, radiusY : number, gradientBrush : GradientBrush, gradientRotation? : number | float, strokeWidth? : number, strokeStyle? : number) : void", "convenience method to draw centered gradients  \ndraws the outline of a rounded rectangle with the corners rounded by the `radiusX` and `radiusY` properties"),
    "DrawRoundedRectangle": makeArgs("function DrawRoundedRectangle(left : number, top : number, right : number, bottom : number, radiusX : number, radiusY : number, brush : Brush, strokeWidth? : number, strokeStyle? : number) : void", "draws the outline of a rounded rectangle with the corners rounded by the `radiusX` and `radiusY` properties"),
    "FillRoundedRectangle": makeArgs("function FillRoundedRectangle(left : number, top : number, right : number, bottom : number, radiusX : number, radiusY : number, brush : Brush) : void", "fills a rounded rectangle with a brush (the corners are rounded by the `radiusX` and `radiusY` properties)"),
    "FillGradientRoundedRectangle": makeArgs("function FillGradientRoundedRectangle(left : number, top : number, right : number, bottom : number, radiusX : number, radiusY : number, gradientBrush : GradientBrush, gradientAngle : number | float) : void", "convenience method to center the gradient with the rectangle  \nfills a rounded rectangle with the `gradientBrush` (the corners are rounded by the `radiusX` and `radiusY` properties)"),
    "GetSize": makeArgs("function GetSize(void) : SizeF | {width : number, height : number}", "returns an object with `width` and `height` properties related to the size of this object"),
    "DrawLine": makeArgs("function DrawLine(fromX : number, fromY : number, toX : number, toY : number, brush : Brush, strokeWidth? : number, strokeStyle? : number) : void", "draws a line starting from (`fromX`, `fromY`) to (`toX`, `toY`)"),
    "DrawGradientLine": makeArgs("function DrawGradientLine(fromX : number, fromY : number, toX : number, toY : number, brush : GradientBrush, gradientRotation? : float, strokeWidth? : number, strokeStyle? : number) : void", ""),
    "Clear": makeArgs("function Clear(r : float, g : float, b : float, alphah? : float) : void", "Clears the render target screen with the set color  \ni had to make alpha work in some cases behind the scenes"),
    "Release": makeArgs("function Release(void) : void", "calls `Release` on this direct2d object and \"deletes\" it"),
    //"windowProc" : makeArgs("function windowProc(hwnd : HWND | number, message : number) : void", "uhhh think of the winProc on regular c++ windows"),
    //"loop" : makeArgs("function loop(void) : void", "this is called when the window is not handling any events"),
    "SetOpacity": makeArgs("function SetOpacity(opacity : float) : void", "sets the opacity of the brush"),
    "GetOpacity": makeArgs("function GetOpacity(void) : float", "gets the opacity of the brush"),
    "GetDpi": makeArgs("function GetDpi(void) : number[2]", "returns an array with the first element being the xDpi and the second being the yDpi"),
    "GetPixelFormat": makeArgs("function PixelFormat(void) : {format : number, alphaMode : number}", "`format` is any `DXGI_FORMAT_` const  \n`alphaMode` is any `D2D1_ALPHA_MODE_` const"),
    //default brush funcs
    "GetPixelSize": makeArgs("function GetPixelSize(void) : {width : number, height : number}", "returns an object with pixelWidth and pixelHeight fields/properties ig about this brush"),
    //"GetSize" : makeArgs("function GetSize(void) : {width : number, height : number}", "returns an object with width and height fields/properties ig about this brush"),
    "CopyFromBitmap": makeArgs("function CopyFromBitmap(startX : number, startY : number, bmp : ID2D1Bitmap, srcLeft : number, srcTop : number, srcRight : number, srcBottom : number) : number", "copies the supplied `bmp` into this bmp  \nreturns 0 or an HRESULT code if failed"),
    "CopyFromRenderTarget": makeArgs("function CopyFromRenderTarget(startX : number, startY : number, renderTarget : ID2D1RenderTarget | number, srcLeft : number, srcTop : number, srcRight : number, srcBottom : number) : void", "copied the supplied `renderTarget` into this bmp"),
    "SetColor": makeArgs("function SetColor(r : float, g : float, b : float, a : float) : void", "sets the color of this brush  \nunlike the GDI drawing function `r`,`g`,`b`,and `a` must be from 0-1 as decimals")
};
function registerFunc(name, info, desc = "") {
    //const shit : JBSType = ;
    funcs.push({ name, info, desc, type: 2, args: info.substring(info.indexOf("(") + 1, info.indexOf(")")).split(", ") });
}
function registerGlobalObject(name, info, desc = "") {
    //const shit : JBSType = ;
    objects.push({ name, info, desc, type: 6 });
}
//#region 
registerFunc("print", "function print(...) : void", "replacement for `console.log` because it no work");
registerFunc("wprint", "function wprint(...) : void", "print but for Utf16 (wchar_t)  \nbasically can sorta print emojis i guess");
registerFunc("version", "function version(void) : string", "returns the version of v8 in string form");
registerFunc("require", "function require(type : string) : Object", "returns a special object  \nusing `fs` gives you an object with `read` and `write` methods");
registerFunc("nigg", "function nigg(void) : string", "returns `\"er\"`");
registerFunc("system", "function system(command : string) : bool", "runs the specified `command` in command prompt  \nreturns true or false if it worked?");
registerFunc("setBackground", "function setBackground(filename : string) : bool", "sets the desktop background to the specified file  \nreturns true if it worked");
registerGlobalObject("file", "an object with convenience methods related to its file", "the only property is `file` which returns the file name");
registerGlobalObject("hInstance", "the hInstance associated with this process", "i mean yeah this is JBS3's HINSTANCE");
registerGlobalObject("screenWidth", "the screen's width", "obtained with `GetSystemMetrics(SM_CXSCREEN)`");
registerGlobalObject("screenHeight", "the screen's height", "obtained with `GetSystemMetrics(SM_CYSCREEN)`");
registerGlobalObject("__dirname", "this file's directory", "think node js!");
registerGlobalObject("args", "the arguments used to start this file", "think something like process.argv[] node js!");
registerFunc("Msgbox", "function Msgbox(description : string, title : string, flags : number) : number", "calls the `windows.h` `MessageBoxA` function  \nthe flags are all the `MB_` constants (can be OR'ed together)  \nreturns a number based on the user's choice");
registerFunc("Inputbox", "function Inputbox(description : string, title : string, placeholder : string) : string", "returns the text the user submitted or none if they `cancelled`");
//registerFunc("CreateWindowClass", "function CreateWindowClass(className : string, init : function, windowProc : function, loop : function) : wndclass | {className : string, windowProc : function, loop : function}", "returns an object with these 3 properties/methods for use with `CreateWindow`");
//registerFunc("CreateWindowClass", "function CreateWindowClass(className? : string, init? : function, windowProc? : function, loop? : function) : WNDCLASSEXA", "returns an object for use with `CreateWindow`  \nyou can use this object like its c++ `WNDCLASSEX` counterpart");
registerFunc("CreateWindowClass", "function CreateWindowClass(className? : string, windowProc? : function, loop? : function) : WNDCLASSEXW", "returns an object for use with `CreateWindow`  \nyou can use this object like its c++ `WNDCLASSEX` counterpart");
//registerFunc("CreateWindow", "function CreateWindow(wndclass : {className : string, windowProc : function, loop : function}, title : string, x : number, y : number, width : number, height : number) : Promise", "returns a promise that is resolved when the window closes");
//registerFunc("CreateWindow", "function CreateWindow(wndclass : WNDCLASSEXA | string, title : string, windowStyles : number, x : number, y : number, width : number, height : number) : HWND | number", "the `wndclass` can be an object created with the `CreateWindowClass` function or a string like `BUTTON` or `CONTROL` ((MSDN link for all special classes)[https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw#remarks])  \nthe windowProc will NOT call WM_CREATE because IDK DAWG just use init  \nwindowStyles can be any `WS_` const (can be OR'd together `|` )  \nreturns the pointer to the newly created window (`HWND`)");
registerFunc("CreateWindow", "function CreateWindow(extendedStyle : number, wndclass : WNDCLASSEXW | string, title : string, windowStyles : number, x : number, y : number, width : number, height : number, hwndParent? : HWND | number, hMenu? : HMENU | number, hInstance? : HINSTANCE | number) : HWND | number", "the extendedStyles can be any `WS_EX_` const (can be OR'd together)  \nthe `wndclass` can be an object created with the `CreateWindowClass` function or a string like `BUTTON` or `CONTROL` ((MSDN link for all special classes)[https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw#remarks])  \nwindowStyles can be any `WS_` const (can be OR'd together `|` )  \nreturns the pointer to the newly created window (`HWND`)");
registerFunc("RedrawWindow", "function RedrawWindow(hwnd : HWND | number, left : number, top : number, right : number, bottom : number, hrgnUpdate : HRGN | number | undefined, flags : number) : number", "can immediately redraw the window like `UpdateWindow`  \n  the flags can be any `RDW_` const (can be OR'd together)  \nreturns 0 if failed"); //https://stackoverflow.com/questions/2325894/difference-between-invalidaterect-and-redrawwindow
registerFunc("InvalidateRect", "function InvalidateRect(hwnd : HWND | number, left : number, top : number, right : number, bottom : number, bErase : boolean) : number", "calls the native `InvalidateRect` which \"schedules\" a redraw  \nreturns 0 if failed");
registerFunc("ShowWindow", "function ShowWindow(hwnd : HWND | number, nCmdShow : number) : number", "returns 0 if failed");
registerFunc("UpdateWindow", "function UpdateWindow(hwnd : HWND | number) : number", "immediately redraws the window  \nreturns 0 if failed");
registerFunc("EnableWindow", "function EnableWindow(hwnd : HWND | number, bEnable : boolean) : number", "usually used for edit windows or combo boxes i think  \nreturns 0 if failed");
registerFunc("SetRect", "function SetRect(rect : RECT, left : number, top : number, right : number, bottom : number) : void", "the `left`,`top`,`right`,`bottom` parameters are copied into `rect` and this function returns nothing  \nthere isn't really a point in using this one and i only made it for `msnexample.js`");
registerFunc("ClientToScreen", "function ClientToScreen(hwnd : HWND | number, &point : {x : number, y : number}) : void", "the new screen point will be copied into `point` and this function returns nothing");
registerFunc("ScreenToClient", "function ScreenToClient(hwnd : HWND | number, &point : {x : number, y : number}) : void", "the new client point will be copied into `point` and this function returns nothing");
registerFunc("SetROP2", "function SetROP2(dc : HDC | number, rop2 : number) : number", "`rop2` can be any `R2_` const  \nreturns 0 if failed");
registerFunc("MAKEROP4", "function MAKEROP4(fore : number, back : number) : number", "`fore` and `back` can be any `SRC...` const  \nonly used for MaskBlt  \n[heres a doc describing more ROP codes](https://learn.microsoft.com/en-us/windows/win32/gdi/ternary-raster-operations?redirectedfrom=MSDN)");
registerFunc("BeginPaint", "function BeginPaint(window? : HWND | number) : PaintStruct | object", "calls the `windows.h` `BeginPaint` function  \nreturns a newly created custom object with the original c++ `PAINTSTRUCT` object's methods");
registerFunc("EndPaint", "function EndPaint(window? : HWND | number, paintstruct : PaintStruct | object) : void", "calls the `windows.h` `EndPaint` function  \ndeletes the paintstruct object");
registerFunc("GetDC", "function GetDC(window? : HWND | number) : HDC | number", "calls the `windows.h` `GetDC` function  \nreturns the pointer (integer in js) to the HDC in c++");
registerFunc("GetWindowDC", "function GetWindowDC(window : HWND | number) : HDC | number", "calls the `windows.h` `GetWindowDC` function which gets the ENTIRE window's device context including the titlebar (well that was a lie but it does include scrollbars)  \nreturns the pointer (integer in js) to the HDC in c++");
registerFunc("SaveDC", "function SaveDC(dc : HDC | number) : number", "calls the `windows.h` `SaveDC` function  \nreturns saved state's position for use with `RestoreDC`");
registerFunc("RestoreDC", "function RestoreDC(dc : HDC | number, savedState : number) : number", "calls the `windows.h` `RestoreDC` function  \nreturns 0 if failed");
registerFunc("DeleteDC", "function DeleteDC(dc : HDC | number) : number", "calls the `windows.h` `usually used on compatible DCs  \nDeleteDC` function  \nreturns 0 if failed");
registerFunc("CreateCompatibleDC", "function CreateCompatibleDC(dc : HDC | number) : HDC | number", "calls the `windows.h` `CreateCompatibleDC` function  \nusually used to draw/manipulate a bitmap (but you can draw TO a bitmap as well)  \nreturns the pointer to the HDC in c++");
registerFunc("CreateCompatibleBitmap", "function CreateCompatibleBitmap(dc : HDC | number, width : number, height : number) : HBITMAP | number", "calls the `windows.h` `CreateCompatibleBitmap` function (apparently draws faster than bitmaps created with `CreateBitmap`)  \nreturns the pointer to the HBITMAP in c++");
registerFunc("ReleaseDC", "function ReleaseDC(window? : HWND | number, dc : HDC | number) : any | number", "calls the `windows.h` `ReleaseDC` function  \nreturns what ever the native c++ function returns idk probably 0");
registerFunc("TextOut", "function TextOut(dc : HDC | number, x : number, y : number, text : string) : any | number", "calls the `windows.h` `TextOutA` function  \nreturns what ever the native c++ function returns");
registerFunc("DrawText", "function DrawText(dc : HDC | number, text : string, left : number, top : number, right : number, bottom : number, format : number) : number", "the format can be any `DT_` const (can be OR'd together)  \nreturns 0 if failed");
registerFunc("CreateFont", "function CreateFont(cHeight : number, cWidth : number, cEscapement : number, cOrientation : number, cWeight : number, bItalic : boolean, bUnderline : boolean, bStrikeOut : boolean, iCharSet : number, iOutPrecision : number, iClipPrecision : number, iQuality : number, iPitchAndFamily : number, pszFaceName? : string) : number", "`cWeight` can be any `FW_` const  \n`iCharSet` can be any ...`_CHARSET` const  \niOutPrecision can be any `OUT_` const  \niClipPrecision can be any `CLIP_` const  \niQuality can be any ...`_QUALITY` const  \niPitchAndFamily can be any ...`_PITCH` | `FF_` consts");
registerFunc("EnumFontFamilies", "function EnumFontFamilies(dc : HDC | number, func : Function(font : LOGFONT, textMetric : TEXTMETRIC, FontType : number)) : void", "takes a function with 3 parameters  \ncalls the native `EnumFontFamiliesExA` function");
registerFunc("CreateFontSimple", "function CreateFontSimple(fontName : string, width : number, height : number) : HFONT | number", "a convenience function because `CreateFont` takes like 30 arguments  \n`fontName` is case-insensitive so \"Impact\" or \"impact\" will work");
//registerFunc("StretchDIBits", "function StretchDIBits(dc : HDC | number, xDest : number, yDest : number, DestWidth : number, DestHeight : number, xSrc : number, ySrc : number, SrcWidth : number, SrcHeight : number, data : number[], imageWidth : number, imageHeight : number, compression : number, rop : number) : number", "data can be any png or jpeg file read with `fs.readBinary`  \ncompression can be any `BI_` const  \nrop can be any `SRC` const (or `NOTSRC` consts lol)  \nreturns 0 if failed");
registerFunc("CreatePatternBrush", "function CreatePatternBrush(bitmap : HBITMAP | number) : HBRUSH | number", "creates a brush with the bitmap as a pattern  \nreturns 0 if failed");
registerFunc("CreateHatchBrush", "function CreateHatchBrush(hatchMode : number, color : RGB | number) : HBRUSH | number", "hatchMode can be any `HS_`  \nuse SetBkMode to make it `TRANSPARENT` or `OPAQUE`  \ncolor must be an `RGB()` value  \nreturns 0 if failed");
registerFunc("BitBlt", "function BitBlt(hdcDest : HDC | number, x : number, y : number, cx : number, cy : number, hdcSrc : HDC | number, x1 : number, y1 : number, rop : number)", "calls the `window.h` `BitBlt` function  \nthe rop parameter is just flags starting with `SRC...`  \nreturns 0 if failed");
registerFunc("StretchBlt", "function StretchBlt(hdcDest : HDC | number, x : number, y : number, cx : number, cy : number, hdcSrc : HDC | number, x1 : number, y1 : number, cx1 : number, cy1 : number, rop : number)", "calls the `window.h` `StretchBlt` function  \nthe rop parameter is just flags starting with `SRC...`  \nreturns 0 if failed");
registerFunc("MaskBlt", "function MaskBlt(hdcDest : HDC | number, x : number, y : number, cx : number, cy : number, hdcSrc : HDC | number, x1 : number, y1 : number, bmpMask : HBITMAP, maskX : number, maskY : number, rop : number)", "calls the `window.h` `MaskBlt` function  \nthe `bmpMask` must be a monochrome bitmap -> (`CreateBitmap(width, height, 1);`)  \nrop can be made by using `MAKEROP4(foregroundrop : number, backgroundrop : number)`  \nthis function will fail if `bmpMask` is not a monochromic bitmap  \nreturns 0 if failed");
registerFunc("TransparentBlt", "function TransparentBlt(hdcDest : HDC | number, xoriginDest : number, yoriginDest : number, wDest : number, hDest : number, hdcSrc : HDC | number, xoriginSrc : number, yoriginSrc : number, wSrc : number, hSrc : number, crTransparent : number)", "calls the `window.h` `TransparentBlt` function  \nthe `crTransparent` parameter is the color to set as transparent `RGB(...)` color  \nreturns 1 if success");
registerFunc("PatBlt", "function PatBlt(dc : HDC | number, x : number, y : number, width : number, height : number, rop : number) : number", "draws the selected HBRUSH onto the `dc`\nthe HBRUSH must be already selected with `SelectObject()`  \nrop can be any `PAT...` const or `DSTINVERT`,`BLACKNESS`,`WHITENESS`  \nreturns 0 if failed");
registerFunc("PlgBlt", "function PlgBlt(dc : HDC | number, pointArray : POINT[3], hdcSrc : HDC | number, xSrc : number, ySrc : number, width : number, height : number, hbmMask? : HBITMAP | number, xMask? : number, yMask? : number) : number", "the pointArray must be an array like this -> `[{x: 0, y: 0}, {x:100, y: 0}, {x:0,y:300}]` yk yk yk  \nreturns 0 if failed MAYBE");
registerFunc("RotateImage", "function RotateImage(dc : HDC | number, x : number, y : number, width : number, height : number, angle : number, hdcSrc : HDC | number, hbmMask? : HBITMAP | number, xMask? : number, yMask? : number) : number", "yeah im not gonna lie this is really weird idk what's goingo n dont be mad if this one doesn't work lol  \ninternally uses `PlgBlt` to rotate an image  \nangle is in degrees  \nreturns 0 if failed");
registerFunc("AlphaBlend", "function AlphaBlend(hdcDest : HDC | number, xoriginDest : number, yoriginDest : number, wDest : number, hDest : number, hdcSrc : HDC | number, xoriginSrc : number, yoriginSrc : number, wSrc : number, hSrc : number, SourceConstantAlpha : number, AlphaFormat : number)", "calls the `window.h` `AlphaBlend` function  \nthe `SourceConstantAlpha` parameter replaces the native BLENDFUNCTION param. This param can be from 0-255 (with 0 it is assumed that your image is transparent and with 255 it uses per-pixel alpha values)  \n`AlphaFormat` can be 0 or 1 (if `AlphaFormat` is 1 `AlphaBlend` will use per-pixel alpha but will fail if the image/bitmap doesn't have a 32 bit depth/count)  \nreturns 1 if success");
registerFunc("SelectObject", "function SelectObject(dc : HDC | number, object : HGDIOBJ | number) : number", "returns a pointer to the last object selected");
registerFunc("CreatePen", "function CreatePen(style : number, width : number, rgb : RGB | number) : HPEN | number", "the style is any `PS_` constant  \nthe style will automatically be set to PS_SOLID if the width is greater than one (windows controls this, sorry!)  \nif you no long need the pen use `DeleteObject(hPen)`  \nto get information about this object use `GetObjectHPEN(hPen)`  \nreturns a pointer to the newly created `HPEN`");
registerFunc("ExtCreatePen", "function ExtCreatePen(style : number, width : number, lBrush : LOGBRUSH) : HPEN | number", "the style must at least include `PS_GEOMETRIC` or `PS_COSMETIC` or `PS_USERSTYLE` (can be OR'd together with other `PS_` constants like `PS_COSMETIC | PS_SOLID`)  \nlBrush can be retrieved by calling `GetObjectHBRUSH(hBrush)` with an existing HBRUSH  \nif you no longer need the pen use `DeleteObject(hPen)`  \nto get information about this object use `GetObjectExtHPEN(hPen)`  \nreturns a pointer to the newly created `HPEN`  \n(MSDN)[https://learn.microsoft.com/en-us/windows/win32/api/wingdi/nf-wingdi-extcreatepen]");
registerFunc("DeleteObject", "function DeleteObject(object : HGDIOBJ | number) : void", "deletes the `HGDIOBJ` supplied");
registerFunc("DestroyCursor", "function DestroyCursor(object : HCURSOR | number) : void", "don't use if the cursor was created with `LoadCursor/LoadCursorFromFile/LoadImage (with LR_SHARED flag)/CopyImage`  \ndestroys the `HCURSOR` supplied");
registerFunc("DestroyIcon", "function DestroyIcon(object : HICON | number) : void", "don't use if the icon was made with `LoadIcon/LoadImage (with LR_SHARED flag)/CopyImage/CreateIconFromResource`  \ndestroys the `HICON` supplied");
registerFunc("SetDCPenColor", "function SetDCPenColor(dc : HDC | number, rgb : RGB | number) : void", "sets the color of the selected pen");
registerFunc("SetDCBrushColor", "function SetDCBrushColor(dc : HDC | number, rgb : RGB | number) : void", "sets the color of the selected brush");
registerFunc("CreateSolidBrush", "function CreateSolidBrush(rgb : RGB | number) : void", "`rgb` can be made with the `RGB` function  \nreturns the pointer to the `HBRUSH`");
registerFunc("MoveTo", "function MoveTo(dc : HDC | number, x : number, y : number) : number", "calls the native `MoveToEx` function for drawing  \nreturns zero if failed");
registerFunc("LineTo", "function LineTo(dc : HDC | number, x : number, y : number) : number", "calls the native `LineTo` function for drawing  \nreturns zero if failed");
registerFunc("Rectangle", "function Rectangle(dc : HDC | number, left : number, top : number, right : number, bottom : number) : number", "calls the native `Rectangle` function for drawing  \nreturns zero if failed");
registerFunc("FillRect", "function FillRect(dc : HDC | number, left : number, top : number, right : number, bottom : number, hBrush : HBRUSH | number) : number", "calls the native gdi `FillRect` function for drawing  \nreturns zero if failed");
registerFunc("GetStockObject", "function GetStockObject(stockObject : number) : HGDIOBJ | number", "calls the native `GetStockObject` function for drawing  \nthe stockObject can be constants ending in brush, pen, or font  \n(`BLACK_BRUSH`, `BLACK_PEN`, `DEVICE_DEFAULT_FONT`, `DEFAULT_PALETTE`)  \nreturns zero if failed");
registerFunc("SetBkColor", "function SetBkColor(dc : HDC | number, rgb : RGB | number) : void", "calls the native `SetBkColor()` which sets the background color for the `TextOut` drawing function");
registerFunc("SetBkMode", "function SetBkMode(dc : HDC | number, mode : number) : void", "calls the native `SetBkMode(mode)` which sets the background mode for the `TextOut` drawing functions  \nonly valid args are `OPAQUE` and `TRANSPARENT`  \nreturns the last background mode");
registerFunc("SetTextColor", "function SetTextColor(dc : HDC | number, rgb : RGB | number) : void", "calls the native `SetTextColor()` which sets the text color for the `TextOut` or `DrawText` gdi drawing functions");
registerFunc("GetPixel", "function GetPixel(dc : HDC | number, x : number, y : number) : RGB | {r : number, g : number, b : number}", "gets the color of the pixel in the `dc` at the points (`x`,`y`)");
registerFunc("SetPixel", "function SetPixel(dc : HDC | number, RGB : number) : {r : number, g : number, b : number} | number", "sets the color of the pixel in the `dc` at the points (`x`,`y`)  \nreturns the set color or -1 if failed");
registerFunc("SetPixelV", "function SetPixelV(dc : HDC | number, RGB : number) : number", "`SetPixelV` is faster than `SetPixel` because it does not need to return the color value of the point actually painted. (MSDN)  \nreturns 0 if failed");
registerFunc("RGB", "function RGB(r : number, g : number, b : number) : number", "creates a single number for the `r`,`g`,`b` values  \nonly used for the GDI functions like `SetDCPenColor` or `SetTextColor`");
registerFunc("GetStretchBltMode", "function GetStretchBltMode(dc : HDC | number) : number", "returns the stretch mode (which can be `BLACKONWHITE`,`COLORONCOLOR`,`HALFTONE`,`WHITEONBLACK`)");
registerFunc("SetStretchBltMode", "function SetStretchBltMode(dc : HDC | number, mode : number) : number", "sets the stretch mode (which can be `BLACKONWHITE`,`COLORONCOLOR`,`HALFTONE`,`WHITEONBLACK`)  \nreturns 0 if failed");
registerFunc("PrintWindow", "function PrintWindow(hwnd : HWND | number, dc : HDC | number, flags : number) : boolean", "copies a visual window into the specified device context (DC), typically a printer DC. (MSDN)  \ni ain't never seen this function in my life  \nreturns 0 if failed");
registerFunc("CreateBitmap", "function CreateBitmap(width : number, height : number, bitCount? : number) : HBITMAP | number", "creates an empty bitmap with the specified width and height  \nsetting the bitCount to 1 gives a monochromic bitmap (the default value is 32)  \nreturns 0 if failed");
registerFunc("FindWindow", "function FindWindow(className? : string, windowTitle : string) : number", "className isn't required and usually is not needed  \nreturns a pointer to the window (`HWND`)");
//registerFunc("GetDesktopWindow", "function GetDesktopWindow(void) : HWND | number", "calls the native `GetDesktopWindow` function and returns the screen's `HWND`");
//registerFunc("GetKeyboardState", "function GetKeyboardState(void) : Array", "calls the native `GetKeyboardState` function and returns an array of length 255");
registerFunc("GetAsyncKeyboardState", "function GetAsyncKeyboardState(void) : Array", "instead of calling `GetKeyboardState` (because it wasn't working) it uses `GetAsyncKeyState` and returns an array of length 255");
registerFunc("GetDefaultFont", "function GetDefaultFont(void) : number", "returns a pointer to the default windows `HFONT` using GetSystemMetrics");
registerFunc("GetKey", "function GetKey(keyCode : number) : bool", "calls the native `GetAsyncKeyState(keyCode) & 0x8000`");
registerFunc("GetKeyDown", "function GetKeyDown(keyCode : number) : bool", "calls the native `GetAsyncKeyState(keyCode) & 0x1` to tell when the key has just been hit");
registerFunc("PostQuitMessage", "function PostQuitMessage(exitCode : number) : void", "calls the native `PostQuitMessage(exitCode);` to terminate a windows `window`");
registerFunc("GetMousePos", "function GetMousePos(void) : {x: number, y: number}", "alias for `GetCursorPos`  \ncalls the native `GetCursorPos()` and returns the RECT's values");
registerFunc("GetCursorPos", "function GetCursorPos(void) : {x: number, y: number}", "calls the native `GetCursorPos()` and returns the RECT's values");
registerFunc("SetMousePos", "function SetMousePos(x : number, y : number) : void", "alias for `SetCursorPos`  \ncalls the native `SetCursorPos(x, y)` and returns 0 if failed");
registerFunc("SetCursorPos", "function SetCursorPos(x : number, y : number) : void", "calls the native `SetCursorPos(x, y)` and returns 0 if failed");
registerFunc("LoadCursor", "function LoadCursor(hInstance? : number | null, lpCursorName : number) : HCURSOR | number", "lpCursorName can be any `IDC_` const  \nif it isn't working pass hInstance as NULL  \ncalls the native `LoadCursorA(hInstance, lpCursorName)` and returns a pointer to the cursor");
registerFunc("LoadCursorFromFile", "function LoadCursorFromFile(lpCursorName : string) : HCURSOR | number", "lpCursorName must be in the `.CUR` or `.ANI` format  \ncalls the native `LoadCursorFromFile(lpCursorName)` and returns a pointer to the cursor  \nsuperseded by LoadImage(NULL, filelocation, ..., IMAGE_CURSOR, ..., LR_SHARED | LR_LOADFROMFILE)");
registerFunc("LoadImage", "function LoadImage(hInstance? : number | null, name : number | string, type : number, width? : number, height? : number, fuLoad : number) : HANDLE | number", "if it isn't working pass hInstance as NULL  \nTHE BITMAP MUST HAVE A `BIT DEPTH <= 24` check the file properties of your bitmap and go to details to find bit depth  \ncalls the native `LoadImageA(hInstance, name, type, width, height, fuLoad)` and returns a pointer to the cursor  \ntype can be any `IMAGE_` const  \nfuLoad can be any `LR_` const (can be OR'd together)  \nif width or height are 0 and you don't use the `LR_DEFAULTSIZE` flag then it will use the icon's actual width/height  \nreturns 0 if failed");
registerFunc("MAKEINTRESOURCE", "function MAKEINTRESOURCE(i : number)", "uses the native `MAKEINTRESOURCEA(i)` macro"); // for use with `LoadCursor`");
registerFunc("SetCursor", "function SetCursor(cursor : HCURSOR | number) : HCURSOR | number", "calls the native `SetCursor(cursor)` function and if cursor is NULL the cursor is removed  \nreturns the last cursor or 0 if failed`");
registerFunc("DrawIconEx", "function DrawIconEx(dc : HDC | number, xLeft : number, yTop : number, hIcon : HICON | number, cxWidth? : number, cyWidth? : number, istepIfAniCur? : number, hbrFlickerFreeDraw? : HBRUSH | number, diFlags? : number) : number", "calls the native `DrawIconEx(...)` function  \ndiFlags can be any `DI_` const (can be OR'd together `|` )  \nreturns 0 if failed`");
registerFunc("DrawIcon", "function DrawIcon(dc : HDC | number, xLeft : number, yTop : number, hIcon : HICON | number) : number", "calls the native `DrawIcon(...)` function  \nreturns 0 if failed`");
registerFunc("LoadIcon", "function LoadIcon(hInstance : HINSTANCE | number, lpIconName : number) : HICON | number", "if it isn't working pass hInstance as NULL  \ncalls the native `LoadIconA(hInstance, lpIconName)` function");
registerFunc("HICONFromHBITMAP", "function HICONFromHBITMAP(bitmap : HBITMAP | number) : HICON | number", "some random function i found on the interwebs lets see if it works  \nuses CreateIconIndirect to create an icon with the bitmap");
registerFunc("createCanvas", "function createCanvas(context : string, type : number, window? : HWND | number) : object<type>", "valid args are `d2d`/`direct2d` and `ID2D1RenderTarget`/`ID2D1DCRenderTarget`  \n`direct3d`/`d3d` not yet implemented  \nreturns an object for the specified type");
registerFunc("Sleep", "function Sleep(ms : number) : void", "calls the native `Sleep(ms)` function to pause the current thread for x milliseconds");
registerFunc("GetClientRect", "function GetClientRect(hwnd : HWND | number) : RECT | {left : number, top : number, right : number, bottom : number}", "calls the native `GetClientRect()` function and returns a `RECT` object with the properties  \n`left`,`right`,`top`,`bottom`");
registerFunc("GetWindowRect", "function GetWindowRect(hwnd : HWND | number) : RECT | {left : number, top : number, right : number, bottom : number}", "calls the native `GetWindowRect()` function and returns a `RECT` object with the properties  \n`left`,`right`,`top`,`bottom`");
registerFunc("GetConsoleWindow", "function GetConsoleWindow(void) : number", "returns a pointer to the console window (`HCONSOLE`)");
registerFunc("DestroyWindow", "function DestroyWindow(hwnd : HWND | number) : void", "calls the native `DestroyWindow` function on the HWND");
//#endregion
registerFunc("GET_X_LPARAM", "function GET_X_LPARAM(lp : LPARAM | number) : number", "use with the `WM_` mouse events to get the x position of the mouse");
registerFunc("GET_Y_LPARAM", "function GET_Y_LPARAM(lp : LPARAM | number) : number", "use with the `WM_` mouse events to get the y position of the mouse");
registerFunc("HIWORD", "function HIWORD(dword : DWORD | number) : number", "Retrieves the high-order word (two bytes) from the specified 32-bit value.  \n<---------------DWORD--------------->  \n[00000000:00000000:00000000:00000000]  \n<-----HIWORD-----><------LOWORD----->"); //"Retrieves the high-order word from the specified 32-bit value.");
registerFunc("LOWORD", "function LOWORD(dword : DWORD | number) : number", "Retrieves the low-order word (two bytes) from the specified 32-bit value.  \n<---------------DWORD--------------->  \n[00000000:00000000:00000000:00000000]  \n<-----HIWORD-----><------LOWORD----->");
//https://www.gamedev.net/forums/topic/17208-wanna-explain-loword-hiword-dword/#:~:text=LOWORD%20gets%20the%20lower%2016,another%20piece%20in%20the%20hiword.
registerFunc("GetWindowText", "function GetWindowText(hwnd : HWND | number) : string", "gets the window title/text of the HWND");
registerFunc("SetWindowText", "function SetWindowText(hwnd : HWND | number, text : string) : boolean", "sets the window title/text of the HWND  \nreturns 0 if failed");
registerFunc("SetWindowPos", "function SetWindowPos(hwnd : HWND | number, hwndInsertAfter : HWND | number, x : number, y : number, cx : number, cy : number, uFlags : number) : number", "hwndInsertAfter is any `HWND_` const  \nvalid flags are any `SWP_` const (can be OR'd together)  \nreturns 0 if failed");
registerFunc("GetForegroundWindow", "function GetForegroundWindow(void) : HWND | number", "gets the foreground window (the window you are literally looking at)");
registerFunc("SetForegroundWindow", "function SetForegroundWindow(hwnd : HWND | number) : number", "sets the foreground window with the supplied `HWND`  \nreturns 0 if failed i think");
registerFunc("GetActiveWindow", "function GetActiveWindow(void) : HWND | number", "slightly different than the foreground window and doesn't seem do anything");
registerFunc("SetActiveWindow", "function SetActiveWindow(hwnd : HWND | number) : HWND | number", "sets the active window (usually for text input windows i think)  \nreturns 0 if failed i think");
registerFunc("SetLayeredWindowAttributes", "function SetLayeredWindowAttributes(hwnd : HWND | number, transparencyColor : RGB | number, alpha : number, dwFlags : number) : number", "`transparencyColor` is an `RGB()` value  \nalpha is 0-255  \ndwFlags can be any `LWA_` const  \nreturns 0 if failed");
registerFunc("GetLayeredWindowAttributes", "function GetLayeredWindowAttributes(hwnd : HWND | number) : {transparencyColor : number, alpha : number, dwFlags : number}", "returns an object with properties about this thing ykyk");
registerFunc("UpdateLayeredWindow", "function UpdateLayeredWindow(hwnd : HWND | number, hdcDst : HDC | number, newPosition? : POINT, newSize? : SIZE, hdcSrc? : HDC | number, location? : POINT, color : RGB | number, SourceConstantAlpha? : number, AlphaFormat? : number, dwFlags : number) : number", "if `hdcSrc` is NULL, hdcDst must be NULL  \nif the current position is not changing, `newPosition` can be NULL  \nif the size of the window is not changing `newSize` can be NULL  \nIf the shape and visual context of the window are not changing, `hdcSrc` can be **NULL**  \nif `hdcSrc` is NULL `location` should be NULL  \ncolor is an integer created with `RGB(r,g,b)`  \n[`SourceConstantAlpha` and `AlphaFormat`](https://learn.microsoft.com/en-us/windows/win32/api/wingdi/ns-wingdi-blendfunction) can be NULL if dwFlags = `ULW_COLORKEY`  \nreturns 0 if failed  \n[MSDN](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatelayeredwindow)");
registerFunc("WindowFromDC", "function WindowFromDC(dc : HDC | number) : HWND | number", "i mean this function explains itself");
registerFunc("WindowFromPoint", "function WindowFromPoint(x : number, y : number) : HWND | number", "yeah this function does that");
registerFunc("EnumWindows", "function EnumWindows(func : Function(hwnd : HWND | number)) : void", "takes a function with 1 parameter  \nloops through all the windows running on your computer");
registerFunc("keybd_event", "function keybd_event(keyCode : number : string, flags : number) : void", "the `keyCode` can be any char or `VK_` const  \nthe flags can be any `KEYEVENTF_` const but normally is just `KEYEVENTF_EXTENDEDKEY` or/and `KEYEVENTF_KEYUP` flags can be OR'd together");
registerFunc("mouse_event", "function mouse_event(dwFlags : number, dx : number, dy : number, dwData : number) : void", "the `dwFlags` can be any `MOUSEEVENTF` const  \nfor wheel events the dwData can be the amount to scroll");
registerFunc("SendInput", "function SendInput(...inputs : {type : number, wVk : number, dwFlags : number}) : void", "successor to the `keybd_event` and `mouse_event` functions  \ntakes any amount of objects that have a `type`, `wVk`, and `dwFlags` property");
registerFunc("MakeKeyboardInput", "function MakeKeyboardInput(keyCode : string | number, keyUp : boolean) : {type : number, wVk : number, dwFlags : number}", "helper function for use with `SendInput`  \nused to include the time property but it actually doesn't do anything");
registerFunc("MakeMouseInput", "function MakeMouseInput(x : number, y : number, mouseData : number | undefined, dwFlags : number) : {type : number, dx : number, dy : number, mouseData : number, dwFlags : number}", "helper function for use with `SendInput`  \nif dwFlags is MOUSEEVENTF_WHEEL then mousedata should be the amount you scroll  \ndwFlags (any `MOUSEEVENTF_` const) can be OR'd together  \nthe `dx` and `dy` params do not have to be 0-65535 because I do the math for you"); //  \nWARNING: if you use `MOUSEEVENTF_ABSOLUTE` the `dx` and `dy` parameters have to be between 0-65535 for some reason so the math is `65535/(screenwidth/x)` and `65535/(screenheight/y)`"); //https://www.desmos.com/calculator/ndgevnyews
registerFunc("GetLastError", "function GetLastError(void) : number", "calls the native `GetLastError()` function  \nreturns the last error code`");
registerFunc("IsIconic", "function IsIconic(hwnd : HWND | number) : boolean", "checks if the window is minimized");
registerFunc("IsChild", "function IsChild(hwndParent : HWND | number, hwnd : HWND | number) : boolean", "checks if `hwnd` is the child of `hwndParent`");
registerFunc("SetParent", "function SetParent(hwndChild : HWND | number, hwndNewParent : HWND | number) : boolean", "sets the parent of `hwndChild`");
registerFunc("GetParent", "function GetParent(hwnd : HWND | number) : HWND", "returns the parent's `HWND`");
registerFunc("SendMessage", "function SendMessage(hwnd : HWND | number, msg : number, wp : number, lp : number) : LRESULT | number", "sends the `msg` to the `hwnd`  \na message can be any `WM_` const");
registerFunc("SetClassLongPtr", "function SetClassLongPtr(hwnd : HWND | number, nIndex : number, dwNewLong : number) : number", "can be used to change window icons AMONG other thangs (look it up)  \nnIndex is any `GCL_` or `GCLP_` const  \nreturns the previous value (can be 0) or 0 if failed");
registerFunc("SetWindowLongPtr", "function SetWindowLongPtr(hwnd : HWND | number, nIndex : number, dwNewLong : number) : number", "if the `hwnd` is a REGULAR (not a button type window or anything like that) window created with `CreateWindow` then you may not use GWLP_USERDATA because JBS3 uses it internally (sorry)  \ncan set some data in a window  \nnIndex is any `GWLP_` or `DWLP_` (if hwnd is a dialogbox)  \nreturns the previous value (can be 0) or 0 if failed");
registerFunc("GetClassLongPtr", "function GetClassLongPtr(hwnd : HWND | number, nIndex : number) : number", "can be used to get a window's icon AMONG other thangs (look it up)  \nnIndex is any `GCL_` or `GCLP_` const");
registerFunc("GetWindowLongPtr", "function GetWindowLongPtr(hwnd : HWND | number, nIndex : number) : number", "can get some data from a window (like its `HINSTANCE` with `GWLP_HINSTANCE`)  \nnIndex is any `GWLP_` or `DWLP_` (if hwnd is a dialogbox)");
registerFunc("GetIconDimensions", "function GetIconDimensions(hIcon : HICON | number) : {width : number, height : number}", "msn example function on how to get the size from an HICON lol  \nreturns an object with `width` and `height` properties"); //\nreturns an object with `cx` and `cy` properties");
registerFunc("GetBitmapDimensions", "function GetBitmapDimensions(hBitmap : HBITMAP | number) : {width : number, height : number}", "helper function to get the size of a loaded bitmap  \nyou don't have to use this anymore because `GetObjectHBITMAP(hBitmap).bmWidth/bmHeight` is now a thing  \nreturns an object with `width` and `height` properties");
registerFunc("SetCapture", "function SetCapture(hwnd : HWND | number) : HWND | number", "sets the mouse capture to the `hwnd`  \nallows your window to still get mouse events even if you aren't hovering over the window  \nreturns the last window that had the mouse or 0");
registerFunc("ReleaseCapture", "function ReleaseCapture() : boolean", "releases the mouse capture from a window  \nreturns 0 if failed");
registerFunc("ClipCursor", "function ClipCursor(left : number, top : number, right : number, bottom : number) : boolean", "restricts the mouse to the supplied rect  \nreturns 0 if failed");
registerFunc("MAKEPOINTS", "function MAKEPOINTS(lParam : LPARAM : number) : {x : number, y : number}", "takes an lparam and converts it to an object with `x` and `y` properties  \nuses the native MAKEPOINTS macro");
registerFunc("GetSystemMetrics", "function GetSystemMetrics(metric : number) : number", "the metric parameter can be any `SM_` const");
registerFunc("_com_error", "function _com_error(HRESULT : number) : string", "used for helping with errors for objects (like `createCanvas(\"direct2d\")` or `createCanvas(\"direct3d\")`)  \nalso apparently can be used like `_com_error(GetLastError())` to get the error in text (which i didn't know worked with get last error)");
registerFunc("Beep", "function Beep(frequency : number, durationMs : number) : number", "plays a sound on your onboard speaker (if you have one) OR plays a sound through your headphones/realtek yk yk yk  \nalso this blocks the thread for `durationMs`");
registerFunc("GetObjectHBITMAP", "function GetObjectHBITMAP(hBitmap : HBITMAP | number) : BITMAP", "returns an object with properties relating to `hBitmap` like its width or height  \nthe bmBits property will be NULL (0) unless `hBitmap` was created with `CreateDIBSection` OR `LoadImage(,,,,,LR_CREATEDIBSECTION)` (and i just found this out)[https://stackoverflow.com/questions/12832292/why-does-getobject-return-an-bitmap-with-null-bmbits]");
registerFunc("CreateBitmapIndirect", "function CreateBitmapIndirect(logBitmap : BITMAP) : HBITMAP | number", "`logBitmap` can be an object made by `GetObjectHBITMAP`  \nuse `DeleteObject` to delete this bitmap when not needed anymore");
registerFunc("GetObjectDIBITMAP", "function GetObjectDIBITMAP(hBitmap : HBITMAP | number) : DIBSECTION", "`hBitmap` must be a bitmap created with `CreateDIBSection`  \nreturns a large object (so large in fact my extension can't handle that rn so you have to `print` to see its properties)");
registerFunc("GetObjectHPALETTE", "function GetObjectHPALETTE(hPalette : HPALLETE) : number", "returns the number of color entries in said palette");
registerFunc("GetObjectExtHPEN", "function GetObjectExtHPEN(hPen : HPEN | number) : EXTLOGPEN", "`hPen` must be an object created with `ExtCreatePen`  \nreturns an object with details about the pen like its width and color");
registerFunc("GetObjectHPEN", "function GetObjectHPEN(hPen : HPEN | number) : LOGPEN", "returns an object with details about this pen like its style, width, and color");
registerFunc("CreatePenIndirect", "function CreatePenIndirect(logPen : LOGPEN) : HPEN | number", "`logPen` can be an object created with `GetObjectHPEN` idk about `GetObjectExtHPEN` though  \nuse `DeleteObject` to delete this pen when not needed anymore");
registerFunc("GetObjectHBRUSH", "function GetObjectHBRUSH(hBrush : HBRUSH | number) : LOGBRUSH", "returns an object with details about this brush like its style, color, and hatch");
registerFunc("CreateBrushIndirect", "function CreateBrushIndirect(logBrush : LOGBRUSH) : HBRUSH | number", "`logBrush` can be an object returned from `GetObjectHBRUSH`  \nuse `DeleteObject` to delete this brush when not needed anymore");
registerFunc("GetObjectHFONT", "function GetObjectHFONT(hFont : HFONT | number) : LOGFONT", "returns an object with details about this font like its `lfFaceName` or `lfHeight` and `lfWidth`");
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
registerFunc("CreateDIBSection", "function CreateDIBSection(dc : HDC | number, dibBitmap : BITMAP, usageFlags : number) : HBITMAP", "`dibBitmap` must be a BITMAP object created with `GetObjectDIBITMAP`  \nusageFlags can be any `DIB_` const");
registerFunc("SetTimer", "function SetTimer(hwnd : HWND | number, timerId? : number, timeMs : number) : number", "sends the `hwnd` a WM_TIMER message every `timeMs` milliseconds  \nif timerId is 0 it will choose a random id and return it  \nreturns the id of the newly created timer");
registerFunc("KillTimer", "function KillTimer(hwnd : HWND | number, timerId : number) : number", "stops the `hwnd`'s timer by its id  \nreturns 0 if failed");
registerFunc("GetGraphicsMode", "function GetGraphicsMode(dc : HDC | number) : number", "returns this device context's graphics mode  \nthe only values can be `GM_COMPATIBLE` or `GM_ADVANCED`");
registerFunc("SetGraphicsMode", "function SetGraphicsMode(dc : HDC | number, mode : number) : number", "`mode` can only be `GM_COMPATIBLE` or `GM_ADVANCED`  \n`GM_LAST` is equal to `GM_ADVANCED`  \ndefault mode is GM_COMPATIBLE");
registerFunc("GetMapMode", "function GetMapMode(dc : HDC | number) : number", "returns this device context's map mode (any `MM_` const)");
registerFunc("SetMapMode", "function SetMapMode(dc : HDC | number, mode : number) : number", "`mode` can be any `MM_` const");
registerFunc("GetWorldTransform", "function GetWorldTransform(dc : HDC | number) : XFORM", "returns an object with properties dawg just look at em");
registerFunc("SetWorldTransform", "function SetWorldTransform(dc : HDC | number, transform : XFORM) : number", "in order to use this function you must use `SetGraphicsMode(GM_ADVANCED)` before it  \ntransform must be an object like one returned from `GetWorldTransform`  \nreturns 0 if failed");
registerFunc("ModifyWorldTransform", "function ModifyWorldTransform(dc : HDC | number, transform? : XFORM | null, mode : number) : number", "in order to use this function you must use `SetGraphicsMode(GM_ADVANCED)` before it  \nmode can be any `MWT_` const (if it is `MWT_IDENTITY` then transform can be NULL and will be ignored)  \nif transform is nonnull it must be an object like one returned from `GetWorldTransform`  \nreturns 0 if failed");
//yeahigottacheckifitworksonchildwindows (it does :sunglasses:)
registerFunc("AnimateWindow", "function AnimateWindow(hwnd : HWND | number, timeMs : number, flags : number)", "flags can be any `AW_` const  \nunfortunately it only animates child windows :(  \nalso apparently this blocks the thread?");
//barely any notes on these because i barely know waht they do im just following guide because i want it to work lol
registerFunc("DwmExtendFrameIntoClientArea", "function DwmExtendFrameIntoClientArea(hwnd : HWND | number, left : number, top : number, right : number, bottom : number) : number", "if `left`,`top`,`right`, and `bottom` are -1 then [something special happens](https://learn.microsoft.com/en-us/windows/win32/api/dwmapi/nf-dwmapi-dwmextendframeintoclientarea?redirectedfrom=MSDN#examples)  \nreturns 0 if success");
registerFunc("DwmEnableBlurBehindWindow", "function DwmEnableBlurBehindWindow(hwnd : HWND | number, enable : boolean, dwFlags : number, left? : number, top? : number, right? : number, bottom? : number) : HRESULT", "returns 0 if success");
registerFunc("DwmDefWindowProc", "function DwmDefWindowProc(hwnd : HWND | number, msg : number, wp : number, lp : number) : boolean", "uhhh im using [this example](https://learn.microsoft.com/en-us/windows/win32/dwm/blur-ovw) check my `customwindowframe.js`  \nreturns 1 if dwm handled the message");
//registerFunc("NCCALCSIZE_PARAMS", "function NCCALCSIZE_PARAMS(lParam : LPARAM | number) : Object", "returns an object... for use with WM_NCCALCSIZE");
registerFunc("DefWindowProc", "function DefWindowProc(hwnd : HWND | number, msg : number, wp : WPARAM | number, lp : LPARAM | number) : LRESULT", "calls the default window proc");
registerFunc("SwitchToThisWindow", "function SwitchToThisWindow(hwnd : HWND | number, fUnknown : boolean) : void", "A TRUE value for fUknown indicates that the window is being switched to using the Alt/Ctl+Tab key sequence. ([MSDN](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-switchtothiswindow))");
registerFunc("showOpenFilePicker", "function showOpenFilePicker(options : Object) : String", "details about the options parameter can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker#examples) BUT check `showOpenFilePicker.js` for example usage (**the options are slightly different**)  \nreturns a list of the file(s) picked");
registerFunc("showSaveFilePicker", "function showSaveFilePicker(options : Object) : String", "details about the options parameter can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker#examples) (options are the same as `showOpenFilePicker`)  \nreturns the path of the file picked (can't do multiple)");
registerFunc("showDirectoryPicker", "function showDirectoryPicker(void) : String", "no options on this one because i lowkey can't be bothered to implement them (they're not that hard to put in but i don't think they're that important to include them)  \nreturns the path of the folder picked (can't do multiple)");
function emptyD2DObject() {
    return [["internalPtr"], ["Release", vscode.CompletionItemKind.Method]]; //{props: [["internalPtr"], ["Release", vscode.CompletionItemKind.Method]]};
}
function defaultBrushObject() {
    return /*{props: */ [["internalPtr"], ["brush"], ["SetOpacity", vscode.CompletionItemKind.Method], ["GetOpacity", vscode.CompletionItemKind.Method], ["Release", vscode.CompletionItemKind.Method]]; //};
}
const vscode = require("vscode");
function activate(context) {
    const RectObject = { props: [["left"], ["top"], ["right"], ["bottom"]] };
    const PointObject = { props: [["x"], ["y"]] };
    const PaintStruct = { props: [["fErase"], ["fIncUpdate"], ["fRestore"], ["hdc"], ["rcPaint", vscode.CompletionItemKind.Class], ["ps"]] };
    const RequireObject = { props: [["read", vscode.CompletionItemKind.Method], ["write", vscode.CompletionItemKind.Method]] };
    const WindowClassObject = { props: [["loop", vscode.CompletionItemKind.Method], ["windowProc", vscode.CompletionItemKind.Method], ["init", vscode.CompletionItemKind.Method], ["hbrBackground"], ["hCursor"], ["hIcon"], ["hIconSm"], ["hInstance"], ["lpszClassName"], ["lpszMenuName"], ["style"], ["DefWindowProc"]] }; //["className"]]};
    const CanvasObject = { props: [["internalDXPtr"], ["renderTarget"], ["BeginDraw", vscode.CompletionItemKind.Method], ["EndDraw", vscode.CompletionItemKind.Method], ["Resize", vscode.CompletionItemKind.Method], ["CreateSolidColorBrush", vscode.CompletionItemKind.Method], ["DrawRectangle", vscode.CompletionItemKind.Method], ["DrawGradientRectangle", vscode.CompletionItemKind.Method], ["FillRectangle", vscode.CompletionItemKind.Method], ["FillGradientRectangle", vscode.CompletionItemKind.Method], ["DrawGradientEllipse", vscode.CompletionItemKind.Method], ["DrawEllipse", vscode.CompletionItemKind.Method], ["FillEllipse", vscode.CompletionItemKind.Method], ["FillGradientEllipse", vscode.CompletionItemKind.Method], ["CreateFont", vscode.CompletionItemKind.Method], ["DrawText", vscode.CompletionItemKind.Method], ["DrawGradientText", vscode.CompletionItemKind.Method], ["CreateBitmap", vscode.CompletionItemKind.Method], ["CreateBitmapFromFilename", vscode.CompletionItemKind.Method], ["DrawBitmap", vscode.CompletionItemKind.Method], ["CreateBitmapBrush", vscode.CompletionItemKind.Method], ["CreateGradientStopCollection", vscode.CompletionItemKind.Method], ["CreateLinearGradientBrush", vscode.CompletionItemKind.Method], ["CreateRadialGradientBrush", vscode.CompletionItemKind.Method], ["RestoreDrawingState", vscode.CompletionItemKind.Method], ["CreateDrawingStateBlock", vscode.CompletionItemKind.Method], ["SaveDrawingState", vscode.CompletionItemKind.Method], ["DrawGradientRoundedRectangle", vscode.CompletionItemKind.Method], ["DrawRoundedRectangle", vscode.CompletionItemKind.Method], ["FillRoundedRectangle", vscode.CompletionItemKind.Method], ["FillGradientRoundedRectangle", vscode.CompletionItemKind.Method], ["GetSize", vscode.CompletionItemKind.Method], ["DrawLine", vscode.CompletionItemKind.Method], ["DrawGradientLine", vscode.CompletionItemKind.Method], ["Clear", vscode.CompletionItemKind.Method], ["Release", vscode.CompletionItemKind.Method]] };
    const IUnknownObject = { props: emptyD2DObject() };
    const SolidColorBrushObject = { props: [...defaultBrushObject(), ["SetColor", vscode.CompletionItemKind.Method], ["GetColor", vscode.CompletionItemKind.Method]] };
    const LinearGradientBrushObject = { props: [...defaultBrushObject(), ["GetStartPoint", vscode.CompletionItemKind.Method], ["GetEndPoint", vscode.CompletionItemKind.Method], ["SetStartPoint", vscode.CompletionItemKind.Method], ["SetEndPoint", vscode.CompletionItemKind.Method], ["SetPoints", vscode.CompletionItemKind.Method]] };
    const RadialGradientBrushObject = { props: [...defaultBrushObject(), ["GetCenter", vscode.CompletionItemKind.Method], ["GetGradientOriginOffset", vscode.CompletionItemKind.Method], ["GetRadiusX", vscode.CompletionItemKind.Method], ["GetRadiusY", vscode.CompletionItemKind.Method], ["GetRadius", vscode.CompletionItemKind.Method], ["SetCenter", vscode.CompletionItemKind.Method], ["SetGradientOriginOffset", vscode.CompletionItemKind.Method], ["SetRadiusX", vscode.CompletionItemKind.Method], ["SetRadiusY", vscode.CompletionItemKind.Method], ["SetRadius", vscode.CompletionItemKind.Method]] };
    const FontObject = { props: [...emptyD2DObject(), /*["family"],*/ ["GetFontSize", vscode.CompletionItemKind.Method], ["GetFlowDirection", vscode.CompletionItemKind.Method], ["GetFontFamilyName", vscode.CompletionItemKind.Method], ["GetFontFamilyNameLength", vscode.CompletionItemKind.Method], ["GetFontStretch", vscode.CompletionItemKind.Method], ["GetFontStyle", vscode.CompletionItemKind.Method], ["GetFontWeight", vscode.CompletionItemKind.Method], ["GetIncrementalTabStop", vscode.CompletionItemKind.Method], ["GetLineSpacing", vscode.CompletionItemKind.Method], ["GetParagraphAlignment", vscode.CompletionItemKind.Method], ["GetReadingDirection", vscode.CompletionItemKind.Method], ["GetTextAlignment", vscode.CompletionItemKind.Method], ["GetWordWrapping", vscode.CompletionItemKind.Method], ["GetTrimming", vscode.CompletionItemKind.Method], ["SetFlowDirection", vscode.CompletionItemKind.Method], ["SetIncrementalTabStop", vscode.CompletionItemKind.Method], ["SetLineSpacing", vscode.CompletionItemKind.Method], ["SetParagraphAlignment", vscode.CompletionItemKind.Method], ["SetReadingDirection", vscode.CompletionItemKind.Method], ["SetTextAlignment", vscode.CompletionItemKind.Method], ["SetTrimming", vscode.CompletionItemKind.Method], ["SetWordWrapping", vscode.CompletionItemKind.Method], ["SetFontSize", vscode.CompletionItemKind.Method]] };
    const BitmapObject = { props: [...emptyD2DObject(), ["GetDpi", vscode.CompletionItemKind.Method], ["GetPixelFormat", vscode.CompletionItemKind.Method], ["GetPixelSize", vscode.CompletionItemKind.Method], ["GetSize", vscode.CompletionItemKind.Method], ["CopyFromBitmap", vscode.CompletionItemKind.Method], ["CopyFromRenderTarget", vscode.CompletionItemKind.Method]] };
    const BitmapBrushObject = { props: [...defaultBrushObject(), ["GetExtendModeX", vscode.CompletionItemKind.Method], ["GetExtendModeY", vscode.CompletionItemKind.Method], ["GetExtendMode", vscode.CompletionItemKind.Method], ["GetInterpolationMode", vscode.CompletionItemKind.Method], ["SetExtendModeX", vscode.CompletionItemKind.Method], ["SetExtendModeY", vscode.CompletionItemKind.Method], ["SetExtendMode", vscode.CompletionItemKind.Method], ["SetInterpolationMode", vscode.CompletionItemKind.Method], ["SetBitmap", vscode.CompletionItemKind.Method], ["GetBitmap", vscode.CompletionItemKind.Method]] };
    // genius regex -> /"(.+)"/g regexr.com/7l8cl
    // the regex tips and tricks are WAY too handy
    //`...`.match(/".+"/g).join(" ").replaceAll(/".+?"/g, "[$&], ")
    const LineSpacingObject = { props: [["lineSpacingMethod"], ["lineSpacing"], ["baseline"]] };
    const TrimmingObject = { props: [["granularity"], ["delimiter"], ["delimiterCount"]] };
    const RGBObject = { props: [["r"], ["g"], ["b"]] };
    const SIZEObject = { props: [["width"], ["height"]] }; //[["cx"], ["cy"]]};
    const GDIHBITMAP = { props: [["bmType"], ["bmWidth"], ["bmHeight"], ["bmWidthBytes"], ["bmPlanes"], ["bmBitsPixel"], ["bmBits"]] };
    const GDIDIBHBITMAP = { props: [["dsBm", vscode.CompletionItemKind.Class], ["dsBmih", vscode.CompletionItemKind.Class], ["dsBitfields"], ["dshSection"], ["dsOffset"]] }; //yeah you just gonna have to find out what the props are
    const GDIExtLPEN = { props: [["elpPenStyle"], ["elpWidth"], ["elpBrushStyle"], ["elpColor"], ["elpHatch"], ["elpNumEntries"]] };
    const GDILPEN = { props: [["lopnStyle"], ["lopnWidth"], ["lopnColor"]] };
    const GDILBRUSH = { props: [["lbStyle"], ["lbColor"], ["lbHatch"]] };
    const GDILFONT = { props: [["lfHeight"], ["lfWidth"], ["lfEscapement"], ["lfOrientation"], ["lfWeight"], ["lfItalic"], ["lfUnderline"], ["lfStrikeOut"], ["lfCharSet"], ["lfOutPrecision"], ["lfClipPrecision"], ["lfQuality"], ["lfPitchAndFamily"], ["lfFaceName"]] };
    const LayeredWindowAttribObj = { props: [["transparencyColor"], ["alpha"], ["dwFlags"]] };
    const TransformObject = { props: [["eM11"], ["eM12"], ["eM21"], ["eM22"], ["eDx"], ["eDy"]] };
    const objectReturningFunctions = [
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
        ["CreateFont", FontObject], ["CreateBitmap", BitmapObject],
        ["CreateBitmapFromFilename", BitmapObject],
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
    ];
    let definedObjects = [];
    //class BrushObject implements JBSObjects {
    //    props: [["shit", vscode.CompletionItemKind.Method]];
    //}
    function calcDefinedObjects(document) {
        definedObjects = [];
        for (let i = 0; i < document.lineCount; i++) {
            for (const orf of objectReturningFunctions) {
                //const line = document.lineAt(i).text.replaceAll("   ", "");
                if ( /*line*/document.lineAt(i).text.includes(orf[0] + "(")) {
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
                    definedObjects.push({ varName: tline.substring(0, tline.indexOf(" =")), object: orf[1] });
                }
            }
        }
        //console.log(definedObjects);
    }
    const signatureHelp = vscode.languages.registerSignatureHelpProvider('javascript', {
        provideSignatureHelp(document, position, token, sigcontext) {
            const line = document.lineAt(position).text;
            calcDefinedObjects(document);
            //if(!line.substring(0, line.indexOf("(")).includes(".")) 
            for (const object of definedObjects) {
                if (line.includes(object.varName)) {
                    for (const method of object.object.props) {
                        if (line.includes(method[0] + "(")) {
                            const func = objectFunctions[method[0]];
                            const param = (line.slice(0, position.character).match(/,/g) || []).length;
                            const sig = new vscode.SignatureInformation("", new vscode.MarkdownString(func.desc)); //func.info, "typescript"));
                            sig.parameters = [
                                new vscode.ParameterInformation(func.args[param], new vscode.MarkdownString(func.info.replace(func.args[param], "**$&**")))
                            ];
                            const sighelp = new vscode.SignatureHelp();
                            sighelp.signatures = [sig];
                            sighelp.activeSignature = 0;
                            sighelp.activeParameter = 0; //param;
                            return sighelp;
                        }
                        //if(method[1] == vscode.CompletionItemKind.Method && line.includes())
                    }
                }
            }
            for (const func of funcs) {
                if (line.includes(func.name + "(")) { //finally getting the correct func LOL!
                    const param = (line.slice(0, position.character).match(/,/g) || []).length;
                    const sig = new vscode.SignatureInformation("", new vscode.MarkdownString(func.desc)); //func.info, "typescript"));
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
                    sighelp.activeParameter = 0; //param;
                    return sighelp;
                    //break;
                }
            }
        },
    });
    const hover = vscode.languages.registerHoverProvider('javascript', {
        provideHover(document, position, token) {
            //let string = "nuh uh";
            calcDefinedObjects(document);
            if (document.getWordRangeAtPosition(position) != undefined) {
                const shit = document.getWordRangeAtPosition(position);
                const line = document.lineAt(position).text;
                const object = line.substring(shit.start.character, shit.end.character);
                let string = "sus";
                let additional = "\n";
                const markdown = new vscode.MarkdownString();
                //const addmarkdown = new vscode.MarkdownString();
                //const defs = [];
                console.log(object, line[shit.end.character]);
                if (line[shit.end.character] == "(") {
                    let quit = false;
                    for (const dObject of definedObjects) {
                        if (line.includes(dObject.varName) && !quit) {
                            console.log(line, dObject.varName);
                            for (const method of dObject.object.props) {
                                if (object == method[0] && line.includes(method[0])) { //lets go EndPaint(hwnd, ps) has hover AND signature
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
                    if (!quit) {
                        for (const func of funcs) {
                            if (object.includes(func.name) && line.includes(func.name + "(")) { //func.name.includes(object)) {
                                string = func.info;
                                additional += func.desc;
                                break;
                            }
                        }
                    }
                } //else {
                //   for(const dObj of definedObjects) {
                //       if(dObj.varName == object) {
                //           string = //uhhhh definedObjects don't hold the name of their creator function :sob:
                //       }
                //   }
                //}
                //console.log(string, additional);
                markdown.appendCodeblock(string, "typescript"); //"print(...) : void", "javascript");
                markdown.appendMarkdown(additional);
                //defs.push(new vscode.Hover(markdown), new vscode.Hover(addmarkdown));
                const def = new vscode.Hover(markdown);
                return def;
            }
        },
    });
    const provider1 = vscode.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems(document, position, token, context) {
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
            const completions = [];
            for (const func of funcs) {
                const completion = new vscode.CompletionItem(func.name, func.type); //vscode.CompletionItemKind.Function);
                //completion.commitCharacters = ['.'];
                completion.detail = func.info;
                completions.push(completion);
            }
            for (const object of objects) {
                const completion = new vscode.CompletionItem(object.name, object.type); //vscode.CompletionItemKind.Function);
                //completion.commitCharacters = ['.'];
                completion.detail = object.info;
                completions.push(completion);
            }
            for (const macro of macros) {
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
    const provider2 = vscode.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `console.`
            // and if so then complete if `log`, `warn`, and `error`
            calcDefinedObjects(document);
            const linePrefix = document.lineAt(position).text.slice(0, position.character);
            for (const object of definedObjects) {
                if (linePrefix.endsWith(object.varName + ".")) {
                    const shit = [];
                    for (const prop of object.object.props) {
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
    }, '.' // triggered whenever a '.' is being typed
    );
    context.subscriptions.push(provider1, provider2, signatureHelp);
}
exports.activate = activate;
const macros = [
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
];
//# sourceMappingURL=extension.js.map