/**
 * Helper class for dealing with files, images etc.
 */
export default class FileHelper {
  public static readonly MB = 1024 * 1024

  /**
   * Is this a file?
   */
  public static isFile(file: File): boolean {
    return file instanceof File
  }

  /**
   * Is this file an image?
   */
  public static isImage(file: File): boolean {
    return file instanceof File && file.type.startsWith("image/")
  }

  /**
   * Is the size of the given file smaller than the given size in bytes?
   */
  public static sizeIsSmallerThan(file: File, maxSizeInBytes: number): boolean {
    if (!(file instanceof File)) {
      throw new Error(`While checking the size of a file, the file is not ` + `an actual file. Its type is ${typeof file}`)
    }
    return file.size < maxSizeInBytes
  }

  /**
   * Is the given file within the avatar image
   * default limit (2 MB)?
   */
  public static isWithinAvatarSize(file: File): boolean {
    return FileHelper.sizeIsSmallerThan(file, 2 * FileHelper.MB)
  }

  /**
   * Is this file empty?
   */
  public static isEmpty(file: File): boolean {
    return file.size === 0
  }
}
