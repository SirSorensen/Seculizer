Participants: Alice, Paren, TPM;
Knowledge: {
    tpm: tpm_sk;
    Shared: tpm_pk;
};
Functions: hash/2;
Format: hash(x,y) = $H(x||y)$;

Protocol: {
    Alice -> TPM: "Boot";
    TPM: pcr := '1';
    TPM -> Alice: "Booted";
    Alice: new n;
    Alice: new esk;
    Alice -> TPM: "Session", {esk}tpm_pk;
    TPM: new sid;
    TPM -> Alice: sid;

    Alice -> TPM: {"Extend", n, sid}esk;
    TPM: pcr := hash(n, pcr);
    TPM -> Alice: "Extended", pcr;
    
    Alice -> TPM: "Create", hash('obt', pcr);
    TPM: new k;
    TPM -> Alice: {|"Created", k, hash('obt', pcr)|}tpm_sk;

    clear: sid, esk;
    Alice: new v;
    Alice -> Parent: "Envelope", {v}k;

    Parent: new esk;
    Parent -> TPM : "Session", {esk}tpm_pk;
    TPM: new sid;
    TPM -> Parent: sid;

    Parent -> TPM: match {
        "Refuse":{
            Parent -> TPM: {"Extend", "ref", sid}esk;
            TPM: pcr := hash("ref", pcr);
            TPM -> Parent: "Extended", pcr;
            Parent -> TPM: "Quote", {v}k;
            TPM -> Parent: {|"Quoted", pcr, {v}k|}tpm_sk;
        };
        "Obtain":{
            Parent -> TPM: {"Extend", "obt", sid}esk;
            TPM: pcr := hash("obt", pcr);
            TPM -> Parent: "Extended", pcr;
            Parent -> TPM: "Decrypt",{v}k, pcr;
            TPM -> Parent: v;
        };

    };
};