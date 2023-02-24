Participants: Alice, Bob;
Functions: exp/2;
Format: exp(x,y) = $x^y$;
Knowledge: {
            Alice: X, msgA;
            Bob: Y, msgB;
            Shared: g;
        };
Equations: exp(exp(g,Y),X) = exp(exp(g,X),Y), exp(exp(g,Y),X) = exp(g,X*Y);


Protocol:
Alice -> Bob: exp(g,X);
Bob -> Alice: exp(g,Y);
Alice-> Bob: {MsgA}exp(exp(g,X),Y);
Bob -> Alice: {MsgB}exp(exp(g,X),Y);
