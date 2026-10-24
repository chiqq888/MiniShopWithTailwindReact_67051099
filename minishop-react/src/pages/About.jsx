function About() {
  return (
    <section className="py-10 sm:py-14" aria-labelledby="about-title">
      <h1 id="about-title" className="text-2xl font-medium">About MiniShop</h1>
      <p className="mt-4 max-w-2xl leading-8 text-shop-muted">
        MiniShop เป็นโปรเจกต์ฝึกพัฒนาเว็บไซต์ด้วย React
        สำหรับค้นหา กรองสินค้า ดูรายละเอียด และทดลองเพิ่มสินค้าลงตะกร้า
      </p>
      <p className="mt-3 max-w-2xl leading-8 text-shop-muted">
        ข้อมูลสินค้าและราคามาจาก Fake Store API เพื่อใช้ในการเรียนรู้
        ไม่มีการซื้อขายหรือชำระเงินจริง
      </p>
    </section>
  );
}

export default About;
