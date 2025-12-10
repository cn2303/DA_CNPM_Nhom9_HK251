import svgPaths from "./svg-vlh4ce9tb6";
import imgImageWithFallback from "figma:asset/dcf943a7f5696d9eb1cd134816cf3ebd726e5013.png";
import imgImageWithFallback1 from "figma:asset/5dc4322362393b4c2f0c85d7469e9908d399f5ad.png";
import imgImageWithFallback2 from "figma:asset/ac785f3393e68e61baf1663b7971b13b394ecabe.png";
import imgImageWithFallback3 from "figma:asset/83be0ce43e9b3e807c2e54ac322c5a02da6f7c13.png";
import imgImageWithFallback4 from "figma:asset/ecdcdbe8ee00b80681c35350f27e3adaac8f7d63.png";
import imgImageWithFallback5 from "figma:asset/ed6874c28b718748b7f82e09a25253f248d946b9.png";

function ImageWithFallback() {
  return (
    <div className="h-[220.425px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col h-[220.425px] items-start left-[16px] overflow-clip rounded-[4px] top-[16px] w-[165.325px]" data-name="Container">
      <ImageWithFallback />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[48px] left-[16px] overflow-clip top-[248.43px] w-[165.325px]" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 top-[-2.2px] w-[140px]">Bài tập xác suất thống kê</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[304.43px] w-[165.325px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">PGS.TS Nguyẽn Đình Huy</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[16px] items-center left-[16px] top-[332.43px] w-[165.325px]" data-name="Container">
      {[...Array(5).keys()].map((_, i) => (
        <Icon key={i} />
      ))}
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[#e7000b] text-[16px] text-nowrap top-[-2.2px] whitespace-pre">120.000đ</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-solid font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 line-through text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">150.000đ</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[44px] items-start left-[16px] top-[360.43px] w-[64.65px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[23.46px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_490)" id="Icon">
          <path d={svgPaths.p10e16200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p683cc80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p35e3f800} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_490">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <button className="absolute bg-[#155dfc] block cursor-pointer h-[36px] left-[16px] overflow-visible rounded-[8px] top-[416.43px] w-[165.325px]" data-name="Button">
      <Icon5 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[55.46px] text-[14px] text-nowrap text-white top-[6.8px] whitespace-pre">Thêm vào giỏ</p>
    </button>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#fb2c36] h-[28px] left-[149px] rounded-[4px] top-[8px] w-[40.325px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[8px] text-[14px] text-nowrap text-white top-[2.8px] whitespace-pre">Mới</p>
    </div>
  );
}

function BookCard() {
  return (
    <div className="absolute bg-white h-[468.45px] left-0 rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[197.325px]" data-name="BookCard">
      <Container />
      <Heading3 />
      <Paragraph />
      <Container1 />
      <Container4 />
      <Button />
      <Container5 />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="h-[220.45px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[220.45px] items-start left-[16px] overflow-clip rounded-[4px] top-[16px] w-[165.338px]" data-name="Container">
      <ImageWithFallback1 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[48px] left-[16px] overflow-clip top-[248.45px] w-[165.338px]" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 top-[-2.2px] w-[164px]">Nhập môn Tiếng Trung Quốc (Quyển 1)</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[304.45px] w-[165.338px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">TS. Lê Thị Thu Hà</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[16px] items-center left-[16px] top-[332.45px] w-[165.338px]" data-name="Container">
      {[...Array(5).keys()].map((_, i) => (
        <Icon6 key={i} />
      ))}
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[360.45px] w-[56.025px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[#e7000b] text-[16px] text-nowrap top-[-2.2px] whitespace-pre">95.000đ</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[23.46px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_485)" id="Icon">
          <path d={svgPaths.p22b32180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pceec000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p35e3f800} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_485">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <button className="absolute bg-[#155dfc] block cursor-pointer h-[36px] left-[calc(50%-0.325px)] overflow-visible rounded-[8px] top-[420px] translate-x-[-50%] w-[165.338px]" data-name="Button">
      <Icon11 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[55.46px] text-[14px] text-nowrap text-white top-[6.8px] whitespace-pre">Thêm vào giỏ</p>
    </button>
  );
}

function BookCard1() {
  return (
    <div className="absolute bg-white h-[468.45px] left-[221.32px] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[197.338px]" data-name="BookCard">
      <Container6 />
      <Heading4 />
      <Paragraph1 />
      <Container7 />
      <Container8 />
      <Button1 />
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="h-[220.45px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback2} />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col h-[220.45px] items-start left-[16px] overflow-clip rounded-[4px] top-[16px] w-[165.338px]" data-name="Container">
      <ImageWithFallback2 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[48px] left-[16px] overflow-clip top-[248.45px] w-[165.338px]" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 top-[-2.2px] w-[163px]">300 Bài tập cơ bản và nâng cao môn hóa học đại cương</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[304.45px] w-[165.338px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">TS. Nguyễn Văn Minh</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[16px] items-center left-[16px] top-[332.45px] w-[165.338px]" data-name="Container">
      {[...Array(5).keys()].map((_, i) => (
        <Icon12 key={i} />
      ))}
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[#e7000b] text-[16px] text-nowrap top-[-2.2px] whitespace-pre">85.000đ</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-solid font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 line-through text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">100.000đ</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col h-[44px] items-start left-[16px] top-[360.45px] w-[56.575px]" data-name="Container">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-[23.46px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_485)" id="Icon">
          <path d={svgPaths.p22b32180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pceec000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p35e3f800} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_485">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <button className="absolute bg-[#155dfc] block cursor-pointer h-[36px] left-[16px] overflow-visible rounded-[8px] top-[416.45px] w-[165.338px]" data-name="Button">
      <Icon17 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[55.46px] text-[14px] text-nowrap text-white top-[6.8px] whitespace-pre">Thêm vào giỏ</p>
    </button>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[#fb2c36] h-[28px] left-[148.06px] rounded-[4px] top-[8px] w-[41.275px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[8px] text-[14px] text-nowrap text-white top-[2.8px] whitespace-pre">Sale</p>
    </div>
  );
}

function BookCard2() {
  return (
    <div className="absolute bg-white h-[468.45px] left-[442.66px] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[197.338px]" data-name="BookCard">
      <Container9 />
      <Heading5 />
      <Paragraph2 />
      <Container10 />
      <Container13 />
      <Button2 />
      <Container14 />
    </div>
  );
}

function ImageWithFallback3() {
  return (
    <div className="h-[220.425px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback3} />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col h-[220.425px] items-start left-[16px] overflow-clip rounded-[4px] top-[16px] w-[165.325px]" data-name="Container">
      <ImageWithFallback3 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute h-[48px] left-[16px] overflow-clip top-[248.43px] w-[165.325px]" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2.2px] whitespace-pre">Luận án Hóa học</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[304.43px] w-[165.325px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">PGS. Trần Thanh Hải</p>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[16px] items-center left-[16px] top-[332.43px] w-[165.325px]" data-name="Container">
      {[...Array(5).keys()].map((_, i) => (
        <Icon18 key={i} />
      ))}
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[360.43px] w-[64.65px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[#e7000b] text-[16px] text-nowrap top-[-2.2px] whitespace-pre">110.000đ</p>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[23.46px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_480)" id="Icon">
          <path d={svgPaths.p22b32180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pceec000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d189e0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_480">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <button className="absolute bg-[#155dfc] block cursor-pointer h-[36px] left-[16px] overflow-visible rounded-[8px] top-[396.43px] w-[165.325px]" data-name="Button">
      <Icon23 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[55.46px] text-[14px] text-nowrap text-white top-[6.8px] whitespace-pre">Thêm vào giỏ</p>
    </button>
  );
}

function BookCard3() {
  return (
    <div className="absolute bg-white h-[468.45px] left-0 rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[492.45px] w-[197.325px]" data-name="BookCard">
      <Container15 />
      <Heading6 />
      <Paragraph3 />
      <Container16 />
      <Container17 />
      <Button3 />
    </div>
  );
}

function ImageWithFallback4() {
  return (
    <div className="h-[220.45px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback4} />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col h-[220.45px] items-start left-[16px] overflow-clip rounded-[4px] top-[16px] w-[165.338px]" data-name="Container">
      <ImageWithFallback4 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="absolute h-[48px] left-[16px] overflow-clip top-[248.45px] w-[165.338px]" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 top-[-2.2px] w-[143px]">Phát triển Bền vững: Cơ Lý hòa Kinh Tế Xanh</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[304.45px] w-[165.338px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">GS.TS Lê Anh Tuấn</p>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[16px] items-center left-[16px] top-[332.45px] w-[165.338px]" data-name="Container">
      {[...Array(5).keys()].map((_, i) => (
        <Icon24 key={i} />
      ))}
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[360.45px] w-[64.65px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[#e7000b] text-[16px] text-nowrap top-[-2.2px] whitespace-pre">130.000đ</p>
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-[23.46px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_480)" id="Icon">
          <path d={svgPaths.p22b32180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pceec000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d189e0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_480">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <button className="absolute bg-[#155dfc] block cursor-pointer h-[36px] left-[16px] overflow-visible rounded-[8px] top-[396.45px] w-[165.338px]" data-name="Button">
      <Icon29 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[55.46px] text-[14px] text-nowrap text-white top-[6.8px] whitespace-pre">Thêm vào giỏ</p>
    </button>
  );
}

function BookCard4() {
  return (
    <div className="absolute bg-white h-[468.45px] left-[221.32px] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[492.45px] w-[197.338px]" data-name="BookCard">
      <Container18 />
      <Heading7 />
      <Paragraph4 />
      <Container19 />
      <Container20 />
      <Button4 />
    </div>
  );
}

function ImageWithFallback5() {
  return (
    <div className="h-[220.45px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback5} />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col h-[220.45px] items-start left-[16px] overflow-clip rounded-[4px] top-[16px] w-[165.338px]" data-name="Container">
      <ImageWithFallback5 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="absolute h-[48px] left-[16px] overflow-clip top-[248.45px] w-[165.338px]" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 top-[-2.2px] w-[135px]">Vật Lý Phóng Xạ và Ứng Dụng</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[304.45px] w-[165.338px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">TS. Nguyễn Quốc Hùng</p>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[16px] items-center left-[16px] top-[332.45px] w-[165.338px]" data-name="Container">
      {[...Array(5).keys()].map((_, i) => (
        <Icon30 key={i} />
      ))}
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[#e7000b] text-[16px] text-nowrap top-[-2.2px] whitespace-pre">98.000đ</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-solid font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 line-through text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">120.000đ</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex flex-col h-[44px] items-start left-[16px] top-[360.45px] w-[56.575px]" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="absolute left-[23.46px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_480)" id="Icon">
          <path d={svgPaths.p22b32180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pceec000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d189e0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_480">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <button className="absolute bg-[#155dfc] block cursor-pointer h-[36px] left-[16px] overflow-visible rounded-[8px] top-[416.45px] w-[165.338px]" data-name="Button">
      <Icon35 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[55.46px] text-[14px] text-nowrap text-white top-[6.8px] whitespace-pre">Thêm vào giỏ</p>
    </button>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[#fb2c36] h-[28px] left-[150.45px] rounded-[4px] top-[8px] w-[38.888px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[8px] text-[14px] text-nowrap text-white top-[2.8px] whitespace-pre">Hot</p>
    </div>
  );
}

function BookCard5() {
  return (
    <div className="absolute bg-white h-[468.45px] left-[442.66px] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[492.45px] w-[197.338px]" data-name="BookCard">
      <Container21 />
      <Heading8 />
      <Paragraph5 />
      <Container22 />
      <Container25 />
      <Button5 />
      <Container26 />
    </div>
  );
}

export default function Container27() {
  return (
    <div className="relative size-full" data-name="Container">
      <BookCard />
      <BookCard1 />
      <BookCard2 />
      <BookCard3 />
      <BookCard4 />
      <BookCard5 />
    </div>
  );
}