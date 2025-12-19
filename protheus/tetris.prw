#include "totvs.ch"

User Function zTetris()
	Local aArea:=FWGetArea()

	FWCallapp("tetris")
	
    FWRestArea(aArea)
Return

