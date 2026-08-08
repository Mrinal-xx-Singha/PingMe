import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const {authUser,socket} = useAuthStore()
  const {selectedUser} = useChatStore()
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const typingTimeoutRef = useRef(null)

  
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const handleInputChange =(e) =>{
    setText(e.target.value)
    if(!selectedUser)return

    // Emit typing event
    socket.emit('typing',{
      senderId:authUser._id,
      receiverId:selectedUser._id
    })

    if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

      // set new timeout to stop typing after 2 seconds of inactivity 
      typingTimeoutRef.current = setTimeout(()=>{
        socket.emit("stopTyping",{
          senderId:authUser._id,
          receiverId:selectedUser._id
        })

      },2000)
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Reset the form
      setText("");
      removeImage();
    } catch (error) {
      toast.error("Failed to send the message. Please try again.");
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text Input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={handleInputChange}
          />
          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          {/* Image Button */}
          <button
            type="button"
            className="btn btn-circle hidden sm:flex"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              size={20}
              className={imagePreview ? "text-emerald-500" : "text-zinc-400"}
            />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
