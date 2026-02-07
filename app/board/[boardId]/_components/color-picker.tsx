"use client";

import { colorTocss } from "@/lib/utils";
import { Color } from "@/types/canvas";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
    onChange : (color: Color) => void;
};

export const ColorPicker = ({
    onChange,
}: ColorPickerProps) => {
    return (
        <div
            className="flex flex-wrap gap-2 itmes-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200"
        >
            <ColorButton color={{ r: 243, g: 82,  b: 35 }} onClick={onChange} /> 
            <ColorButton color={{ r: 236, g: 72,  b: 153 }} onClick={onChange} /> 
            <ColorButton color={{ r: 124, g: 58,  b: 237 }} onClick={onChange} /> 
            <ColorButton color={{ r: 56,  g: 189, b: 248 }} onClick={onChange} /> 
            <ColorButton color={{ r: 20,  g: 184, b: 166 }} onClick={onChange} />
            <ColorButton color={{ r: 34,  g: 197, b: 94 }} onClick={onChange} /> 
            <ColorButton color={{ r: 245, g: 158, b: 11 }} onClick={onChange} />
            <ColorButton color={{ r: 100, g: 116, b: 139 }} onClick={onChange} /> 

        </div>
    );
};

interface ColorButtonProps {
    onClick: (color: Color) => void;
    color: Color;
}

const ColorButton = ({
    onClick,
    color,
}: ColorButtonProps) => {
    return (
        <Button
            className = "w-8 h-8 p-0 items-center flex justify-center hover:opacity-75 transition"
            onClick = {() => onClick(color)}
        >
            <div className="w-full h-full rounded-md border border-neutral-300"
                style = {{ background: colorTocss(color)}}        
            />
        </Button>
    );
};
