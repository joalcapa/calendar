'use client'

import React, { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Calendar: React.FC<{ children: ReactNode}> = ({ children }) => (
    <DndProvider backend={HTML5Backend}>
        {children}
    </DndProvider>
);

export default Calendar;