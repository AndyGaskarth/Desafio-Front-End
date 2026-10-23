import nft1_480 from "../assets/optimized/NFTSlaoq15H31-480.webp";
import nft1_960 from "../assets/optimized/NFTSlaoq15H31-960.webp";
import nft1_1440 from "../assets/optimized/NFTSlaoq15H31-1440.webp";
import nft2_480 from "../assets/optimized/NFTSlaoq31A51-480.webp";
import nft2_960 from "../assets/optimized/NFTSlaoq31A51-960.webp";
import nft2_1440 from "../assets/optimized/NFTSlaoq31A51-1440.webp";
import nft3_480 from "../assets/optimized/NFTSlaoq71G31-480.webp";
import nft3_960 from "../assets/optimized/NFTSlaoq71G31-960.webp";
import nft3_1440 from "../assets/optimized/NFTSlaoq71G31-1440.webp";

const variants: Record<string, { fallback: string; srcSet: string }> = {
  "1": {
    fallback: nft1_480,
    srcSet: `${nft1_480} 480w, ${nft1_960} 960w, ${nft1_1440} 1440w`,
  },
  "2": {
    fallback: nft2_480,
    srcSet: `${nft2_480} 480w, ${nft2_960} 960w, ${nft2_1440} 1440w`,
  },
  "3": {
    fallback: nft3_480,
    srcSet: `${nft3_480} 480w, ${nft3_960} 960w, ${nft3_1440} 1440w`,
  },
};

export function responsiveImage(id: string, fallback: string) {
  const variant = variants[id];
  return variant
    ? { image: variant.fallback, srcSet: variant.srcSet }
    : { image: fallback, srcSet: undefined };
}
