import React from "react";
import { Image as ImageIcon, Link as LinkIcon, Paperclip, X } from "lucide-react";
import supabase from "@/supabase-client";

type PostInputProps = {
  onSubmit?: (data: { title: string; content: string }) => void;
};

const PostInput: React.FC<PostInputProps> = ({ onSubmit }) => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [imageNames, setImageNames] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [Post, setPost] = React.useState([]);
  const [newPost, setNewPost] = React.useState("");


  const titleLimit = 80;
  const contentLimit = 500;

  const isDisabled =
    isSubmitting || title.trim().length === 0 || content.trim().length === 0;
  const isExpanded =
    expanded || title.trim().length > 0 || content.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled) return;
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";


    try {
      setIsSubmitting(true);
        const {data, error} = await supabase.from("Posts").insert([{title, description}]).single();
        
        if (error) {
            console.log("Failed to add data : ", error)
        } else {
            setPost((prev) => [...prev, data])
            setNewPost("")
        }
      const payload = { title: title.trim(), content: content.trim() };
      onSubmit ? onSubmit(payload) : console.log("Post submitted:", payload);
      setTitle("");
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlurForm = (e: React.FocusEvent<HTMLFormElement>) => {
    // Collapse only if both fields are empty and focus moves outside the form
    if (title.trim().length === 0 && content.trim().length === 0) {
      const current = e.currentTarget;
      // Defer to allow next focused element to be set
      setTimeout(() => {
        if (!current.contains(document.activeElement)) {
          setExpanded(false);
        }
      }, 0);
    }
  };

  const handlePickImages = () => {
    setExpanded(true);
    fileInputRef.current?.click();
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setImageNames(files.map((f) => f.name));
      setExpanded(true);
    } else {
      setImageNames([]);
    }
  };

  const handleAddLink = () => {
    setExpanded(true);
    setShowLinkInput(true);
  };

  const handleClearLink = () => {
    setLinkUrl("");
    setShowLinkInput(false);
  };

  return (
    <section id="post" className="mt-0">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
        <form
          onSubmit={handleSubmit}
          onBlur={handleBlurForm}
          className="relative p-4 sm:p-5"
        >
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
          Create a New Post
          </h2>
          <p className="mt-1 text-white/70 text-xs sm:text-sm">
          Share job updates or information.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div>
              <label
                htmlFor="post-title"
                className="block text-xs text-white/70 mb-2"
              >
                Title
              </label>
              <div className="relative">
                <input
                  id="post-title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value.slice(0, titleLimit));
                    setNewPost(e.target.value);
                  }}
                  onFocus={() => setExpanded(true)}
                  placeholder="Example: Frontend Developer React (Remote)"
                  className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-3.5 py-2.5 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">
                  {title.length}/{titleLimit}
                </span>
              </div>
            </div>

            {isExpanded && (
              <>
                <div>
                  <label
                    htmlFor="post-content"
                    className="block text-xs text-white/70 mb-2"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="post-content"
                      name="description"
                      value={content}
                      onChange={(e) =>
                        setContent(e.target.value.slice(0, contentLimit))
                      }
                      placeholder="Write brief details, links, or requirements."
                      rows={3}
                      className="w-full resize-y rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-3.5 py-2.5 text-sm"
                    />
                    <span className="absolute right-3 bottom-2 text-[11px] text-white/50">
                      {content.length}/{contentLimit}
                    </span>
                  </div>
                </div>

                {/* Attachment toolbar moved below description */}
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePickImages}
                      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Link
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                    >
                      <Paperclip className="h-4 w-4" />
                      Attachment
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImagesChange}
                    />
                  </div>
                  {imageNames.length > 0 && (
                    <div className="text-[11px] text-white/60 truncate">
                      {imageNames.length} file selected
                    </div>
                  )}
                </div>

                {showLinkInput && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="Paste URL here"
                      className="flex-1 rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-3.5 py-2.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleClearLink}
                      className="inline-flex items-center justify-center rounded-lg px-2.5 py-2 text-xs font-medium transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                      aria-label="Clear link"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="text-xs text-white/60">
                  Posts will appear after approval.
                  </div>
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors border border-white/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/15 text-white"
                  >
                    {isSubmitting ? "Mengirim..." : "Posting"}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default PostInput;
