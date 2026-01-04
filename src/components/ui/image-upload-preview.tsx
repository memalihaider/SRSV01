import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Check } from 'lucide-react';

interface ImageUploadPreviewProps {
  title?: string;
  description?: string;
  uploadType: 'url' | 'file';
  onUploadTypeChange: (type: 'url' | 'file') => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  imageFile: File | null;
  onImageFileChange: (file: File | null) => void;
  previewImage: string;
  iconColor?: string;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  title = "Image Upload",
  description = "Upload an image or provide an image URL",
  uploadType,
  onUploadTypeChange,
  imageUrl,
  onImageUrlChange,
  imageFile,
  onImageFileChange,
  previewImage,
  iconColor = "text-blue-600"
}) => {
  return (
    <Card className="border-2 border-gray-100 shadow-sm">
      <CardHeader className="pb-6 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Upload className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
            <CardDescription className="text-gray-600">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Preview */}
          <div className="shrink-0">
            <div className="w-32 h-24 rounded-lg bg-gray-200 border-2 border-gray-300 overflow-hidden">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-4 w-full">
            {/* Upload Type Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={uploadType === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUploadTypeChange('url')}
                className="flex-1 sm:flex-none"
              >
                <Upload className="w-4 h-4 mr-2" />
                URL
              </Button>
              <Button
                type="button"
                variant={uploadType === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUploadTypeChange('file')}
                className="flex-1 sm:flex-none"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>

            {/* Conditional Input */}
            {uploadType === 'url' ? (
              <div className="space-y-2">
                <Label htmlFor="image-url" className="text-sm font-medium">
                  Image URL
                </Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => onImageUrlChange(e.target.value)}
                  className="border-2 focus:border-primary"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="image-file" className="text-sm font-medium">
                  Select Image File
                </Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImageFileChange(file);
                    }
                  }}
                  className="border-2 focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {imageFile && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-700 font-medium">
                      Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadPreview;
