import React from "react";
import { Image as ImageIcon, Link as LinkIcon, X } from "lucide-react";
import supabase from "@/supabase-client";

type PostInputProps = {
  onSubmit?: (data: { title: string; content: string; images?: string[] }) => void;
};

const PostInput: React.FC<PostInputProps> = ({ onSubmit }) => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const titleLimit = 80;
  const contentLimit = 500;
  const maxImages = 5;
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const isDisabled =
    isSubmitting || title.trim().length === 0 || content.trim().length === 0;
  const isExpanded =
    expanded || title.trim().length > 0 || content.trim().length > 0;

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading image ${i + 1}/${files.length}...`);

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("image-post")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(
          `Failed to upload ${file.name}: ${uploadError.message}`
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("image-post").getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    setUploadProgress("");
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled) return;

    try {
      setIsSubmitting(true);

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to create a post");
        return;
      }

      // Upload images if any
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages(selectedFiles);
      }

      // Insert post dengan user_id
      const { data, error } = await supabase
        .from("Posts")
        .insert([
          {
            title: title.trim(),
            description: content.trim(),
            images: imageUrls.length > 0 ? imageUrls : null,
            link_url: linkUrl.trim() || null,
            user_id: user.id, // Simpan user_id
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Failed to add post:", error);
        alert(`Failed to create post: ${error.message}`);
        return;
      }

      console.log("Post created successfully:", data);

      if (onSubmit) {
        onSubmit({
          title: title.trim(),
          content: content.trim(),
          images: imageUrls,
        });
      }

      // Reset form
      setTitle("");
      setContent("");
      setSelectedFiles([]);
      setLinkUrl("");
      setShowLinkInput(false);
      setExpanded(false);

      alert("Post created successfully!");
    } catch (error: any) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const handleBlurForm = (e: React.FocusEvent<HTMLFormElement>) => {
    if (title.trim().length === 0 && content.trim().length === 0) {
      const current = e.currentTarget;
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

    if (files.length === 0) return;

    if (files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed per post`);
      return;
    }

    const validFiles: File[] = [];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert(
          `File ${file.name} is not a valid image type. Use JPG, PNG, GIF, or WEBP.`
        );
        continue;
      }
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setExpanded(true);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
                  onChange={(e) =>
                    setTitle(e.target.value.slice(0, titleLimit))
                  }
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

                {/* Image preview */}
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 text-[10px] text-white/80 bg-black/60 px-1.5 py-0.5 rounded">
                          {file.name.length > 15
                            ? file.name.substring(0, 15) + "..."
                            : file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload progress */}
                {uploadProgress && (
                  <div className="text-xs text-white/70 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    {uploadProgress}
                  </div>
                )}

                {/* Attachment toolbar */}
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePickImages}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Link
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      multiple
                      className="hidden"
                      onChange={handleImagesChange}
                    />
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="text-[11px] text-white/60">
                      {selectedFiles.length}/{maxImages} images selected
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
                    Your post will appear immediately.
                  </div>
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors border border-white/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/15 text-white"
                  >
                    {isSubmitting ? "Posting..." : "Post"}
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