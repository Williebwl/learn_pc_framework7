namespace WebApi.Controllers.Tag
{
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Tag;
    using BIStudio.Framework.UI;
    using Models.Tag;

    public class TagGroupController : ApplicationService<TagGroupVM, PagedQuery, SYSTagGroup>
    {
        public TagGroupController() : base("GroupName") { }
    }
}