



export const postList = async (req, res) => {

    try{



    }catch(err){
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }


}